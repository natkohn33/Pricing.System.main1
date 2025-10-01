import * as turf from '@turf/turf';

export interface ServiceAreaPolygon {
  division: string;
  csrCenter: string;
  serviceRegion: string;
  citiesAreas: string;
  polygon: turf.Feature<turf.Polygon>;
}

export interface ServiceAreaBoundingBox {
  division: string;
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
  citiesAreas: string;
  region: string;
  serviceRegion: string;
}

export interface SpatialValidationResult {
  isServiceable: boolean;
  division?: string;
  csrCenter?: string;
  serviceRegion?: string;
  citiesAreas?: string;
  matchType: 'polygon' | 'bounding-box' | 'none';
  coordinates: [number, number];
}

export class SpatialValidator {
  private serviceAreaPolygons: ServiceAreaPolygon[] = [];
  private serviceAreaBoundingBoxes: ServiceAreaBoundingBox[] = [];
  private fallbackBoundingBoxes: ServiceAreaBoundingBox[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeServiceAreas();
  }

  /**
   * Initialize service area data from the required files
   */
  private async initializeServiceAreas(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🗺️ Initializing spatial service area validation...');

      // Load division polygons from public/data/division-polygons.json
      await this.loadDivisionPolygons();

      // Load service areas CSV from public/data/service-areas.csv
      await this.loadServiceAreasCsv();

      // Load fallback coordinate data from src/data/FWS Pricing tool coordindate fall back - Sheet1.csv
      await this.loadFallbackCoordinates();

      this.isInitialized = true;
      console.log('✅ Spatial service area validation initialized successfully:', {
        polygons: this.serviceAreaPolygons.length,
        serviceAreaBoundingBoxes: this.serviceAreaBoundingBoxes.length,
        fallbackBoundingBoxes: this.fallbackBoundingBoxes.length
      });

    } catch (error) {
      console.error('❌ Error initializing spatial service area validation:', error);
      throw new Error(`Failed to initialize spatial validation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load division polygons from public/data/division-polygons.json
   */
  private async loadDivisionPolygons(): Promise<void> {
    try {
      const response = await fetch('/data/division-polygons.json');
      if (!response.ok) {
        throw new Error(`Failed to load division polygons: ${response.status} ${response.statusText}`);
      }

      const geoJsonData = await response.json();
      console.log('📍 Loaded division polygons GeoJSON:', {
        type: geoJsonData.type,
        featuresCount: geoJsonData.features?.length || 0
      });

      if (geoJsonData.features) {
        this.serviceAreaPolygons = geoJsonData.features.map((feature: any) => ({
          division: feature.properties.Division || feature.properties.division_name,
          csrCenter: feature.properties['CSR Center'] || feature.properties.csr_center,
          serviceRegion: feature.properties['SVC Region'] || feature.properties.service_region,
          citiesAreas: feature.properties['Cities/Areas within Division'] || feature.properties.cities_areas,
          polygon: feature
        }));

        console.log('🗺️ Processed division polygons:', {
          count: this.serviceAreaPolygons.length,
          divisions: this.serviceAreaPolygons.map(p => p.division)
        });
      }
    } catch (error) {
      console.error('❌ Error loading division polygons:', error);
      throw error;
    }
  }

  /**
   * Load service areas from public/data/service-areas.csv
   */
  private async loadServiceAreasCsv(): Promise<void> {
    try {
      const response = await fetch('/data/service-areas.csv');
      if (!response.ok) {
        throw new Error(`Failed to load service areas CSV: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');

      console.log('📊 Loading service areas CSV:', {
        totalLines: lines.length,
        headers: headers
      });

      // Parse CSV data
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 8) {
          const boundingBox: ServiceAreaBoundingBox = {
            division: values[3]?.trim() || '',
            minLng: parseFloat(values[4]) || 0,
            minLat: parseFloat(values[5]) || 0,
            maxLng: parseFloat(values[6]) || 0,
            maxLat: parseFloat(values[7]) || 0,
            citiesAreas: values[8]?.trim() || '',
            region: values[9]?.trim() || '',
            serviceRegion: values[10]?.trim() || ''
          };

          if (boundingBox.division && boundingBox.minLng && boundingBox.minLat && boundingBox.maxLng && boundingBox.maxLat) {
            this.serviceAreaBoundingBoxes.push(boundingBox);
          }
        }
      }

      console.log('📊 Processed service areas CSV:', {
        count: this.serviceAreaBoundingBoxes.length,
        divisions: this.serviceAreaBoundingBoxes.map(b => b.division)
      });

    } catch (error) {
      console.error('❌ Error loading service areas CSV:', error);
      throw error;
    }
  }

  /**
   * Load fallback coordinates from src/data/FWS Pricing tool coordindate fall back - Sheet1.csv
   */
  private async loadFallbackCoordinates(): Promise<void> {
    try {
      // Import the CSV content directly since it's in src/data
      const csvContent = `division_name,minLng,minLat,maxLng,maxLat,Cities/Areas within Division,Region,Service Region
Texoma,-97.16885574,33.41900439,-96.36691973,33.89971317,"Sherman, Denison, Gainesville",North Texas (NTX),Open Market
Justin,-98.02140393,32.73337639,-96.75771805,33.63457366,"Justin, Denton, Flower Mound",North Texas (NTX),Open Market
Cresson,-98.18680673,31.99526624,-97.36620877,32.97777098,"Cresson, Granbury, Weatherford",North Texas (NTX),Open Market
Mansfield,-97.43204146,32.37899776,-97.00425976,32.75976257,"Mansfield, Arlington, Burleson",North Texas (NTX),Open Market
Dallas,-97.12424093,32.3193859,-96.30983386,33.05500375,"Dallas, Garland, Mesquite",North Texas (NTX),Open Market
Hillsboro,-98.14582479,31.14590028,-96.68372867,32.47570733,"Hillsboro, Waxahachie, Corsicana",Central Texas (CTX),Open Market
Mexia,-96.92438858,31.01626,-95.62133727,32.01765184,"Mexia, Groesbeck, Fairfield",Central Texas (CTX),Open Market
Bayou,-95.07853014,29.11474011,-93.96559763,30.26851644,"Baytown, La Porte, Pasadena",South Texas (STX),Open Market
Dayton,-95.45941502,29.65405731,-94.52898209,30.45752936,"Dayton, Liberty, Cleveland",South Texas (STX),Open Market
Houston,-95.81383585,29.29406375,-94.99757876,29.7785517,"Houston (eastern parts), Channelview",South Texas (STX),Open Market
Jersey Village,-95.95455256,29.68984487,-95.36151424,30.24946013,"Jersey Village, Cypress, Tomball",South Texas (STX),Open Market
Hearne,-96.58602507,31.4980217,-96.47034691,31.55159317,"Hearne, Bryan, College Station",Central Texas (CTX),Open Market
San Marcos,-98.49039542,29.33723655,-97.28453832,30.50214276,"San Marcos, Kyle, Buda",Central Texas (CTX),Open Market
San Antonio,-99.13238412,28.77824681,-97.82136507,30.04284588,"San Antonio, New Braunfels, Seguin",Central Texas (CTX),Open Market
Corpus,-98.34867716,27.1858627,-96.77625553,28.90063375,"Corpus Christi, Kingsville, Robstown",South Texas (STX),Open Market
McKinney,-96.75868191,33.118834,-96.49333375,33.2774329,"McKinney, Allen, Frisco",North Texas (NTX),Open Market`;

      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',');

      console.log('📊 Loading fallback coordinates CSV:', {
        totalLines: lines.length,
        headers: headers
      });

      // Parse CSV data
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 7) {
          const boundingBox: ServiceAreaBoundingBox = {
            division: values[0]?.trim() || '',
            minLng: parseFloat(values[1]) || 0,
            minLat: parseFloat(values[2]) || 0,
            maxLng: parseFloat(values[3]) || 0,
            maxLat: parseFloat(values[4]) || 0,
            citiesAreas: values[5]?.replace(/"/g, '').trim() || '',
            region: values[6]?.replace(/"/g, '').trim() || '',
            serviceRegion: values[7]?.replace(/"/g, '').trim() || ''
          };

          if (boundingBox.division && boundingBox.minLng && boundingBox.minLat && boundingBox.maxLng && boundingBox.maxLat) {
            this.fallbackBoundingBoxes.push(boundingBox);
          }
        }
      }

      console.log('📊 Processed fallback coordinates CSV:', {
        count: this.fallbackBoundingBoxes.length,
        divisions: this.fallbackBoundingBoxes.map(b => b.division)
      });

    } catch (error) {
      console.error('❌ Error loading fallback coordinates:', error);
      throw error;
    }
  }

  /**
   * Validate if coordinates fall within any service area
   * This is the primary method that must be called after geocoding
   */
  public async validateCoordinates(
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string
  ): Promise<SpatialValidationResult> {
    // Ensure initialization is complete
    if (!this.isInitialized) {
      await this.initializeServiceAreas();
    }

    const coordinates: [number, longitude] = [longitude, latitude]; // GeoJSON uses [lng, lat] format
    
    console.log('🌍 Validating coordinates against service areas:', {
      address: `${address}, ${city}, ${state}`,
      coordinates: [latitude, longitude],
      polygonsToCheck: this.serviceAreaPolygons.length,
      boundingBoxesToCheck: this.serviceAreaBoundingBoxes.length + this.fallbackBoundingBoxes.length
    });

    // STEP 1: Check against division polygons (most precise)
    for (const serviceArea of this.serviceAreaPolygons) {
      try {
        const point = turf.point(coordinates);
        const isInside = turf.booleanPointInPolygon(point, serviceArea.polygon);
        
        if (isInside) {
          console.log('✅ POLYGON MATCH FOUND:', {
            division: serviceArea.division,
            csrCenter: serviceArea.csrCenter,
            serviceRegion: serviceArea.serviceRegion,
            citiesAreas: serviceArea.citiesAreas,
            coordinates: [latitude, longitude]
          });

          return {
            isServiceable: true,
            division: serviceArea.division,
            csrCenter: serviceArea.csrCenter,
            serviceRegion: serviceArea.serviceRegion,
            citiesAreas: serviceArea.citiesAreas,
            matchType: 'polygon',
            coordinates: [latitude, longitude]
          };
        }
      } catch (error) {
        console.warn('⚠️ Error checking polygon for division:', serviceArea.division, error);
      }
    }

    // STEP 2: Check against service areas bounding boxes
    for (const boundingBox of this.serviceAreaBoundingBoxes) {
      if (this.isPointInBoundingBox(latitude, longitude, boundingBox)) {
        console.log('✅ SERVICE AREA BOUNDING BOX MATCH FOUND:', {
          division: boundingBox.division,
          region: boundingBox.region,
          serviceRegion: boundingBox.serviceRegion,
          citiesAreas: boundingBox.citiesAreas,
          coordinates: [latitude, longitude],
          boundingBox: {
            minLng: boundingBox.minLng,
            minLat: boundingBox.minLat,
            maxLng: boundingBox.maxLng,
            maxLat: boundingBox.maxLat
          }
        });

        return {
          isServiceable: true,
          division: boundingBox.division,
          csrCenter: boundingBox.region,
          serviceRegion: boundingBox.serviceRegion,
          citiesAreas: boundingBox.citiesAreas,
          matchType: 'bounding-box',
          coordinates: [latitude, longitude]
        };
      }
    }

    // STEP 3: Check against fallback coordinate bounding boxes
    for (const boundingBox of this.fallbackBoundingBoxes) {
      if (this.isPointInBoundingBox(latitude, longitude, boundingBox)) {
        console.log('✅ FALLBACK BOUNDING BOX MATCH FOUND:', {
          division: boundingBox.division,
          region: boundingBox.region,
          serviceRegion: boundingBox.serviceRegion,
          citiesAreas: boundingBox.citiesAreas,
          coordinates: [latitude, longitude],
          boundingBox: {
            minLng: boundingBox.minLng,
            minLat: boundingBox.minLat,
            maxLng: boundingBox.maxLng,
            maxLat: boundingBox.maxLat
          }
        });

        return {
          isServiceable: true,
          division: boundingBox.division,
          csrCenter: boundingBox.region,
          serviceRegion: boundingBox.serviceRegion,
          citiesAreas: boundingBox.citiesAreas,
          matchType: 'bounding-box',
          coordinates: [latitude, longitude]
        };
      }
    }

    // STEP 4: No spatial match found
    console.log('❌ NO SPATIAL MATCH FOUND:', {
      address: `${address}, ${city}, ${state}`,
      coordinates: [latitude, longitude],
      checkedPolygons: this.serviceAreaPolygons.length,
      checkedBoundingBoxes: this.serviceAreaBoundingBoxes.length + this.fallbackBoundingBoxes.length
    });

    return {
      isServiceable: false,
      matchType: 'none',
      coordinates: [latitude, longitude]
    };
  }

  /**
   * Check if a point falls within a bounding box
   */
  private isPointInBoundingBox(
    latitude: number,
    longitude: number,
    boundingBox: ServiceAreaBoundingBox
  ): boolean {
    return (
      longitude >= boundingBox.minLng &&
      longitude <= boundingBox.maxLng &&
      latitude >= boundingBox.minLat &&
      latitude <= boundingBox.maxLat
    );
  }

  /**
   * Get all available service divisions
   */
  public getAvailableDivisions(): string[] {
    const polygonDivisions = this.serviceAreaPolygons.map(p => p.division);
    const boundingBoxDivisions = [
      ...this.serviceAreaBoundingBoxes.map(b => b.division),
      ...this.fallbackBoundingBoxes.map(b => b.division)
    ];
    
    return [...new Set([...polygonDivisions, ...boundingBoxDivisions])];
  }

  /**
   * Get service area statistics
   */
  public getServiceAreaStats(): {
    totalPolygons: number;
    totalBoundingBoxes: number;
    totalFallbackBoxes: number;
    divisions: string[];
    regions: string[];
  } {
    const allDivisions = this.getAvailableDivisions();
    const allRegions = [
      ...new Set([
        ...this.serviceAreaBoundingBoxes.map(b => b.region),
        ...this.fallbackBoundingBoxes.map(b => b.region)
      ])
    ];

    return {
      totalPolygons: this.serviceAreaPolygons.length,
      totalBoundingBoxes: this.serviceAreaBoundingBoxes.length,
      totalFallbackBoxes: this.fallbackBoundingBoxes.length,
      divisions: allDivisions,
      regions: allRegions
    };
  }
}

// Create singleton instance
export const spatialValidator = new SpatialValidator();