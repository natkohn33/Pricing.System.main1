import { type ServiceAreaResult, type LocationRequest } from '../types';
import { detectColumns, detectCSVHeaderRow, parseServiceRequests } from './csvParser';
import { isFranchisedCity, getFranchisedCityName, matchFranchisedCity } from './franchisedCityMatcher';
import { spatialValidator } from './spatialValidator';
import { CONTAINER_SIZES } from '../data/divisions';

export interface ServiceAreaValidator {
  validateLocation(
    id: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    companyName: string,
    latitude: number | null,
    longitude: number | null,
    equipmentType: string,
    containerSize: string,
    frequency: string,
    materialType: string,
    addOns: string[],
    binQuantity: number
  ): Promise<ServiceAreaResult>;
}

export class ServiceAreaValidator {
  /**
   * Get list of recognized container sizes
   */
  private getRecognizedContainerSizes(): string[] {
    const standardSizes = CONTAINER_SIZES.map(size => size.value);
    
    // Add additional recognized sizes that might not be in the standard list
    const additionalSizes = [
      '95-gallon', '96-gallon', '65-gallon', '1-Cart', '2-Carts', '3-Carts',
      'Cart', 'Toter', 'Polycart', 'Commercial Cart', 'Residential Cart',
      'Extra Cart', 'Additional Cart', 'Manual Collection', 'Hand Collection',
      'VIP', 'Vertipack', 'Compactor', 'Self-Contained', 'Stationary',
      'Detachable Container', 'Receiver Box', 'PERM RO', 'Various'
    ];
    
    return [...standardSizes, ...additionalSizes];
  }

  /**
   * Normalize container size for validation
   */
  private normalizeContainerSizeForValidation(containerSize: string): string {
    if (!containerSize || typeof containerSize !== 'string') {
      return '';
    }

    const normalized = containerSize.toLowerCase().trim();
    
    // Handle compactor variations
    if (normalized.includes('comp')) {
      return 'Compactor';
    }
    
    // Handle cart variations
    if (normalized.includes('cart')) {
      return 'Cart';
    }
    
    // Handle gallon variations
    if (normalized.includes('gallon') || normalized.includes('gal')) {
      const galMatch = normalized.match(/(\d+)/);
      return galMatch ? `${galMatch[1]}-gallon` : normalized;
    }
    
    // Extract YD sizes - handle both "8 yard" and "8yd" formats
    const ydMatch = normalized.match(/(\d+)\s*(yard|yd)/i);
    if (ydMatch) {
      return `${ydMatch[1]}YD`;
    }
    
    // Handle cases where it's just a number (assume YD)
    const numberMatch = normalized.match(/^(\d+)$/);
    if (numberMatch && numberMatch[1]) {
      const num = parseInt(numberMatch[1]);
      // Only convert to YD if it's a reasonable container size
      if (num >= 1 && num <= 40) {
        return `${num}YD`;
      }
    }
    
    return normalized;
  }

  /**
   * Validate if a location is serviceable
   */
  async validateLocation(
    id: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    companyName: string,
    latitude: number | null,
    longitude: number | null,
    equipmentType: string,
    containerSize: string,
    frequency: string,
    materialType: string,
    addOns: string[],
    binQuantity: number
  ): Promise<ServiceAreaResult> {
    console.log('🗺️ Validating service area for:', {
      id,
      companyName,
      city,
      state,
      equipmentType,
      containerSize,
      frequency,
      hasCoordinates: latitude !== null && longitude !== null,
      coordinates: latitude && longitude ? [latitude, longitude] : null
    });

    // Get franchise fee and sales tax for this city
    const franchisedCityMatch = await matchFranchisedCity(city, state);
    const cityFranchiseFee = franchisedCityMatch.franchiseFee || 0;
    const citySalesTax = franchisedCityMatch.salesTax || 8.25;
    
    console.log('🏛️ City franchise fee lookup:', {
      city,
      state,
      franchiseFee: cityFranchiseFee,
      salesTax: citySalesTax,
      isMatch: franchisedCityMatch.isMatch
    });

    // CRITICAL: Ensure franchise fee is properly applied for Houston and all other cities
    console.log('🏛️ FRANCHISE FEE APPLICATION CHECK:', {
      city: city,
      normalizedCity: city.toLowerCase().trim(),
      franchiseFeeFromMatch: franchisedCityMatch.franchiseFee,
      salesTaxFromMatch: franchisedCityMatch.salesTax,
      isHouston: city.toLowerCase().trim() === 'houston',
      houstonOverrideApplied: city.toLowerCase().trim() === 'houston' ? '4%' : 'N/A'
    });

    // PRIORITY CHECK 1: Cities explicitly marked as not serviceable (HIGHEST PRIORITY)
    const notServiceableCities = [
      'pasadena', 'el paso', 'amarillo', 'arlington', 'burleson',
      'league city', 'the woodlands', 'allen', 'bedford', 'carrollton', 
      'flower mound', 'forest hill', 'haltom city', 'grapevine', 
      'grand prairie', 'hurst', 'keller', 'aledo', 'la porte', 
      'lewisville', 'north richland hills', 'missouri city', 'plano', 
      'pflugerville', 'prosper', 'rockwall', 'round rock', 'rowlett', 
      'southlake', 'sugar land', 'the colony', 'lubbock', 'university city', 
      'harker heights', 'webster', 'universal city', 'friendswood', 
      'richmond', 'rosenberg'
    ];
    const normalizedCity = city.toLowerCase().trim();
    const normalizedState = state.toLowerCase().trim();
    
    if ((normalizedState === 'texas' || normalizedState === 'tx') && 
        notServiceableCities.includes(normalizedCity)) {
      console.log('🚫 PRIORITY CHECK 1: City explicitly marked as not serviceable:', city, state);
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'not-serviceable',
        reason: `${city}, ${state} is not in our service area`,
        division: 'Not Serviceable',
        serviceRegion: 'Not Serviceable',
        franchiseFee: cityFranchiseFee
      };
    }

    // PRIORITY CHECK 1.5: Equipment-specific restrictions for Beaumont, Texas
    if ((normalizedState === 'texas' || normalizedState === 'tx') && 
        normalizedCity === 'beaumont') {
      const normalizedEquipmentType = equipmentType.toLowerCase().trim();
      
      // Check for front-load container variations
      if (normalizedEquipmentType.includes('front') || 
          normalizedEquipmentType.includes('front-load') || 
          normalizedEquipmentType.includes('frontload') ||
          normalizedEquipmentType === 'front load' ||
          normalizedEquipmentType === 'fl' ||
          normalizedEquipmentType.includes('dumpster') ||
          normalizedEquipmentType.includes('container')) {
        
        console.log('🚫 EQUIPMENT RESTRICTION: Front-load container not serviceable in Beaumont, TX:', {
          city: city,
          state: state,
          equipmentType: equipmentType,
          normalizedEquipmentType: normalizedEquipmentType,
          ruleApplied: 'Beaumont front-load restriction'
        });
        
        return {
          id,
          companyName,
          address,
          city,
          state,
          zipCode,
          equipmentType,
          containerSize,
          frequency,
          materialType,
          addOns,
          binQuantity,
          latitude,
          longitude,
          status: 'not-serviceable',
          reason: `Front-load containers are not serviceable in ${city}, ${state}`,
          division: 'Not Serviceable',
          serviceRegion: 'Not Serviceable',
          franchiseFee: cityFranchiseFee
        };
      }
    }

    // PRIORITY CHECK 2: Spatial validation using coordinates (MANDATORY)
    if (latitude !== null && longitude !== null) {
      console.log('🌍 PRIORITY CHECK 2: Performing spatial validation using coordinates...');
      
      try {
        const spatialResult = await spatialValidator.validateCoordinates(
          latitude,
          longitude,
          address,
          city,
          state
        );

        if (spatialResult.isServiceable) {
          console.log('✅ SPATIAL VALIDATION: Location is serviceable', {
            division: spatialResult.division,
            matchType: spatialResult.matchType,
            coordinates: spatialResult.coordinates
          });

          // PRIORITY CHECK 2.1: Container size validation for serviceable locations
          const recognizedSizes = this.getRecognizedContainerSizes();
          const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
          
          console.log('📦 Container size validation for serviceable location:', {
            original: containerSize,
            normalized: normalizedContainerSize,
            recognizedSizes: recognizedSizes.slice(0, 10) // Show first 10 for logging
          });
          
          // Check if container size is recognized
          const isRecognizedSize = recognizedSizes.some(size => 
            size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
            size.toLowerCase() === containerSize.toLowerCase().trim()
          );
          
          if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
            console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (serviceable location):', {
              containerSize,
              normalizedContainerSize,
              availableSizes: recognizedSizes
            });
            
            return {
              id,
              companyName,
              address,
              city,
              state,
              zipCode,
              equipmentType,
              containerSize,
              frequency,
              materialType,
              addOns,
              binQuantity,
              latitude,
              longitude,
              status: 'manual-review',
              reason: `Container size "${containerSize}" is not recognized and requires manual review`,
              division: spatialResult.division,
              serviceRegion: spatialResult.serviceRegion || 'Open Market',
              franchiseFee: cityFranchiseFee
            };
          }

          return {
            id,
            companyName,
            address,
            city,
            state,
            zipCode,
            equipmentType,
            containerSize,
            frequency,
            materialType,
            addOns,
            binQuantity,
            latitude,
            longitude,
            status: 'serviceable',
            reason: '',
            division: spatialResult.division,
            serviceRegion: spatialResult.serviceRegion || 'Open Market',
            franchiseFee: cityFranchiseFee
          };
        } else {
          console.log('❌ SPATIAL VALIDATION: Location is NOT serviceable', {
            coordinates: spatialResult.coordinates,
            matchType: spatialResult.matchType
          });

          // PRIORITY CHECK 2.5: Austin override - if spatial validation fails but city is Austin, mark as serviceable
          if (normalizedCity === 'austin' && (normalizedState === 'texas' || normalizedState === 'tx')) {
            console.log('✅ AUSTIN OVERRIDE: Spatial validation failed but city is Austin, marking as serviceable');
            
            // PRIORITY CHECK 2.6: Container size validation for Austin override
            const recognizedSizes = this.getRecognizedContainerSizes();
            const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
            
            // Check if container size is recognized
            const isRecognizedSize = recognizedSizes.some(size => 
              size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
              size.toLowerCase() === containerSize.toLowerCase().trim()
            );
            
            if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
              console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (Austin override):', {
                containerSize,
                normalizedContainerSize,
                availableSizes: recognizedSizes
              });
              
              return {
                id,
                companyName,
                address,
                city,
                state,
                zipCode,
                equipmentType,
                containerSize,
                frequency,
                materialType,
                addOns,
                binQuantity,
                latitude,
                longitude,
                status: 'manual-review',
                reason: `Container size "${containerSize}" is not recognized and requires manual review`,
                division: 'CTX',
                serviceRegion: 'Open Market',
                franchiseFee: cityFranchiseFee
              };
            }
            
            return {
              id,
              companyName,
              address,
              city,
              state,
              zipCode,
              equipmentType,
              containerSize,
              frequency,
              materialType,
              addOns,
              binQuantity,
              latitude,
              longitude,
              status: 'serviceable',
              reason: '',
              division: 'CTX',
              serviceRegion: 'Open Market',
              franchiseFee: cityFranchiseFee
            };
          }

          return {
            id,
            companyName,
            address,
            city,
            state,
            zipCode,
            equipmentType,
            containerSize,
            frequency,
            materialType,
            addOns,
            binQuantity,
            latitude,
            longitude,
            status: 'not-serviceable',
            reason: `Location coordinates [${latitude.toFixed(4)}, ${longitude.toFixed(4)}] fall outside all defined service areas`,
            division: 'Not Serviceable',
            serviceRegion: 'Not Serviceable',
            franchiseFee: cityFranchiseFee
          };
        }
      } catch (error) {
        console.error('❌ Error during spatial validation:', error);
        
        // PRIORITY CHECK 2.5: Austin override - if spatial validation errors but city is Austin, mark as serviceable
        if (normalizedCity === 'austin' && (normalizedState === 'texas' || normalizedState === 'tx')) {
          console.log('✅ AUSTIN OVERRIDE: Spatial validation error but city is Austin, marking as serviceable');
          
          // PRIORITY CHECK 2.6: Container size validation for Austin override (error case)
          const recognizedSizes = this.getRecognizedContainerSizes();
          const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
          
          // Check if container size is recognized
          const isRecognizedSize = recognizedSizes.some(size => 
            size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
            size.toLowerCase() === containerSize.toLowerCase().trim()
          );
          
          if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
            console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (Austin override - error case):', {
              containerSize,
              normalizedContainerSize,
              availableSizes: recognizedSizes
            });
            
            return {
              id,
              companyName,
              address,
              city,
              state,
              zipCode,
              equipmentType,
              containerSize,
              frequency,
              materialType,
              addOns,
              binQuantity,
              latitude,
              longitude,
              status: 'manual-review',
              reason: `Container size "${containerSize}" is not recognized and requires manual review`,
              division: 'CTX',
              serviceRegion: 'Open Market',
              franchiseFee: cityFranchiseFee
            };
          }
          
          return {
            id,
            companyName,
            address,
            city,
            state,
            zipCode,
            equipmentType,
            containerSize,
            frequency,
            materialType,
            addOns,
            binQuantity,
            latitude,
            longitude,
            status: 'serviceable',
            reason: '',
            division: 'CTX',
            serviceRegion: 'Open Market',
            franchiseFee: cityFranchiseFee
          };
        }
        
        // Continue to fallback validation methods if spatial validation fails
        console.log('⚠️ Falling back to legacy validation methods due to spatial validation error');
      }
    } else {
      console.log('⚠️ No coordinates available for spatial validation, using fallback methods');
    }

    // PRIORITY CHECK 3: Franchised cities (if spatial validation failed or no coordinates)
    if (isFranchisedCity(city, state)) {
      const franchisedCityName = getFranchisedCityName(city, state);
      console.log('🏛️ FALLBACK: Franchised city detected:', {
        originalCity: city,
        franchisedCityName,
        state,
        equipmentType,
        containerSize,
        frequency
      });
      
      // PRIORITY CHECK 3.1: Container size validation for franchised cities
      const recognizedSizes = this.getRecognizedContainerSizes();
      const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
      
      // Check if container size is recognized
      const isRecognizedSize = recognizedSizes.some(size => 
        size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
        size.toLowerCase() === containerSize.toLowerCase().trim()
      );
      
      if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
        console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (franchised city):', {
          containerSize,
          normalizedContainerSize,
          availableSizes: recognizedSizes
        });
        
        return {
          id,
          companyName,
          address,
          city,
          state,
          zipCode,
          equipmentType,
          containerSize,
          frequency,
          materialType,
          addOns,
          binQuantity,
          latitude,
          longitude,
          status: 'manual-review',
          reason: `Container size "${containerSize}" is not recognized and requires manual review`,
          division: `${franchisedCityName} (Municipal Contract)`,
          serviceRegion: `${franchisedCityName} Municipal`,
          franchiseFee: cityFranchiseFee
        };
      }
      
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'serviceable',
        reason: '',
        division: `${franchisedCityName} (Municipal Contract)`,
        serviceRegion: `${franchisedCityName} Municipal`,
        franchiseFee: cityFranchiseFee
      };
    }


    // PRIORITY CHECK 4: Cities explicitly marked as serviceable (legacy fallback)
    const explicitlyServiceableCities = [
      'burleson',
      'crosby'
    ];
    
    if ((normalizedState === 'texas' || normalizedState === 'tx') && 
        explicitlyServiceableCities.includes(normalizedCity)) {
      console.log('✅ FALLBACK: City explicitly marked as serviceable:', city, state);
      
      // Determine appropriate division for explicitly serviceable cities
      const division = this.determineDivision(city, state) || 'NTX'; // Default to NTX if no specific division found
      
      // PRIORITY CHECK 4.1: Container size validation for explicitly serviceable cities
      const recognizedSizes = this.getRecognizedContainerSizes();
      const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
      
      // Check if container size is recognized
      const isRecognizedSize = recognizedSizes.some(size => 
        size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
        size.toLowerCase() === containerSize.toLowerCase().trim()
      );
      
      if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
        console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (explicitly serviceable city):', {
          containerSize,
          normalizedContainerSize,
          availableSizes: recognizedSizes
        });
        
        return {
          id,
          companyName,
          address,
          city,
          state,
          zipCode,
          equipmentType,
          containerSize,
          frequency,
          materialType,
          addOns,
          binQuantity,
          latitude,
          longitude,
          status: 'manual-review',
          reason: `Container size "${containerSize}" is not recognized and requires manual review`,
          division,
          serviceRegion: 'Open Market',
          franchiseFee: cityFranchiseFee
        };
      }
      
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'serviceable',
        reason: '',
        division,
        serviceRegion: 'Open Market',
        franchiseFee: cityFranchiseFee
      };
    }

    // Basic validation
    if (!address || !city || !state) {
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'not-serviceable',
        reason: 'Missing required address information',
        division: 'Invalid',
        serviceRegion: 'Invalid',
        franchiseFee: cityFranchiseFee
      };
    }

    // Check if state is serviceable (Texas, Oklahoma, Louisiana, Arkansas)
    const serviceableStates = ['texas', 'tx'];
    
    if (!serviceableStates.includes(normalizedState)) {
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'not-serviceable',
        reason: `Service only available in Texas. ${state} is outside our service area.`,
        division: 'Not Serviceable',
        serviceRegion: 'Not Serviceable',
        franchiseFee: cityFranchiseFee
      };
    }

    // Determine division based on city and state
    const division = this.determineDivision(city, state);
    
    if (!division) {
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'not-serviceable',
        reason: `${city}, ${state} is not in our service area - no division mapping found`,
        division: 'Not Serviceable',
        serviceRegion: 'Not Serviceable',
        franchiseFee: cityFranchiseFee
      };
    }

    // PRIORITY CHECK 5: Container size validation for locations with division mapping
    const recognizedSizes = this.getRecognizedContainerSizes();
    const normalizedContainerSize = this.normalizeContainerSizeForValidation(containerSize);
    
    // Check if container size is recognized
    const isRecognizedSize = recognizedSizes.some(size => 
      size.toLowerCase() === normalizedContainerSize.toLowerCase() ||
      size.toLowerCase() === containerSize.toLowerCase().trim()
    );
    
    if (!isRecognizedSize && containerSize && containerSize.trim() !== '') {
      console.log('🚩 CONTAINER SIZE FLAGGED FOR MANUAL REVIEW (division mapped location):', {
        containerSize,
        normalizedContainerSize,
        availableSizes: recognizedSizes
      });
      
      return {
        id,
        companyName,
        address,
        city,
        state,
        zipCode,
        equipmentType,
        containerSize,
        frequency,
        materialType,
        addOns,
        binQuantity,
        latitude,
        longitude,
        status: 'manual-review',
        reason: `Container size "${containerSize}" is not recognized and requires manual review`,
        division,
        serviceRegion: 'Open Market',
        franchiseFee: cityFranchiseFee
      };
    }

    // Location is serviceable
    return {
      id,
      companyName,
      address,
      city,
      state,
      zipCode,
      equipmentType,
      containerSize,
      frequency,
      materialType,
      addOns,
      binQuantity,
      latitude,
      longitude,
      status: 'serviceable',
      reason: '',
      division,
      serviceRegion: 'Open Market',
      franchiseFee: cityFranchiseFee
    };
  }

  /**
   * Parse location requests from CSV data
   */
  parseLocationRequestsFromData(data: string[][], fileName: string): LocationRequest[] {
    console.log('📊 Parsing location requests from data:', { fileName, dataLength: data.length });
    
    try {
      // Detect header row
      const headerRowIndex = detectCSVHeaderRow(data);
      console.log('📋 Header row detected at index:', headerRowIndex);
      
      if (headerRowIndex === -1 || headerRowIndex >= data.length) {
        throw new Error('No valid header row found in CSV data');
      }
      
      // Extract headers
      const headers = data[headerRowIndex];
      
      if (!headers || headers.length === 0) {
        throw new Error('Header row is empty or invalid');
      }
      
      // Detect column mapping
      const columnMapping = detectColumns(headers);
      console.log('🗂️ Column mapping detected:', columnMapping);
      
      // Parse service requests using the detected structure
      const serviceRequests = parseServiceRequests(data, columnMapping);
      console.log('✅ Successfully parsed service requests:', serviceRequests.length);
      
      // Map ServiceRequest to LocationRequest (add missing properties)
      const locationRequests: LocationRequest[] = serviceRequests.map(request => ({
        id: request.id,
        companyName: request.customerName, // Map customerName to companyName
        address: request.address,
        city: request.city,
        state: request.state,
        zipCode: request.zipCode,
        equipmentType: request.equipmentType,
        containerSize: request.containerSize,
        frequency: request.frequency,
        materialType: request.materialType,
        addOns: request.addOns,
        binQuantity: request.binQuantity,
        latitude: null, // CSV doesn't include coordinates
        longitude: null // CSV doesn't include coordinates
      }));
      
      return locationRequests;
    } catch (error) {
      console.error('❌ Error parsing location requests:', error);
      throw error;
    }
  }

  /**
   * Determine service division based on city and state
   */
  private determineDivision(city: string, state: string): string | null {
    const cityLower = city.toLowerCase().trim();
    const stateLower = state.toLowerCase().trim();

    // Texas divisions
    if (stateLower === 'texas' || stateLower === 'tx') {
      // NTX cities
      const ntxCities = ['dallas', 'fort worth', 'plano', 'garland', 'irving', 'grand prairie', 'mesquite', 'mckinney', 'carrollton', 'frisco', 'denton', 'richardson', 'lewisville', 'allen', 'flower mound', 'mansfield', 'euless', 'desoto', 'grapevine', 'bedford', 'haltom city', 'wylie', 'keller', 'coppell', 'duncanville', 'rockwall', 'farmers branch', 'rowlett', 'the colony', 'southlake', 'watauga', 'colleyville', 'corinth', 'highland village', 'lancaster', 'little elm', 'north richland hills', 'princeton', 'sachse', 'addison', 'cedar hill', 'glenn heights', 'murphy', 'prosper', 'red oak', 'seagoville', 'university park', 'cockrell hill', 'combine', 'highland park', 'hutchins', 'ovilla', 'sunnyvale', 'wilmer'];

      // STX cities  
      const stxCities = ['houston', 'corpus christi', 'conroe', 'pearland', 'league city', 'sugar land', 'baytown', 'beaumont', 'missouri city', 'galveston', 'conroe', 'texas city', 'huntsville', 'lufkin', 'tyler', 'longview', 'texarkana', 'port arthur', 'orange', 'liberty', 'cleveland', 'dayton', 'tomball', 'jersey village', 'cypress', 'humble', 'katy', 'spring'];

      // CTX cities
      const ctxCities = ['austin', 'san antonio', 'waco', 'killeen', 'temple', 'bryan', 'college station', 'round rock', 'cedar park', 'georgetown', 'pflugerville', 'leander', 'san marcos', 'new braunfels', 'kyle', 'buda', 'dripping springs', 'bee cave', 'lakeway', 'west lake hills', 'rollingwood', 'sunset valley', 'manchaca', 'del valle', 'elgin', 'manor', 'hutto', 'taylor', 'granger', 'jarrell', 'florence', 'liberty hill', 'bertram', 'burnet', 'marble falls', 'horseshoe bay', 'granite shoals', 'cottonwood shores', 'meadowlakes', 'spicewood', 'lockhart', 'luling', 'gonzales', 'nixon', 'smiley', 'waelder', 'flatonia', 'muldoon', 'schulenburg', 'weimar', 'columbus', 'eagle lake', 'wallis', 'orchard', 'east bernard', 'boling', 'wharton', 'hungerford', 'louise', 'blessing', 'midfield', 'matagorda', 'bay city', 'wadsworth', 'markham', 'van vleck', 'sweeny', 'west columbia', 'brazoria', 'angleton', 'lake jackson', 'clute', 'freeport', 'surfside beach', 'quintana', 'hearne', 'franklin', 'bremond', 'calvert', 'reagan', 'centerville', 'normangee', 'madisonville', 'midway', 'crockett', 'lovelady', 'grapeland', 'elkhart', 'palestine', 'davilla', 'rogers', 'buckholts', 'cameron', 'rockdale', 'thorndale', 'thrall', 'belton'];

      // NTX cities - add missing cities from division data
      const ntxCitiesExpanded = [...ntxCities, 'weatherford', 'granbury', 'cresson', 'sherman', 'denison', 'gainesville', 'justin', 'flower mound'];
      
      if (ntxCitiesExpanded.includes(cityLower)) {
        return 'NTX';
      } else if (stxCities.includes(cityLower)) {
        return 'STX';
      } else if (ctxCities.includes(cityLower)) {
        return 'CTX';
      }
    }

    return null;
  }
}
