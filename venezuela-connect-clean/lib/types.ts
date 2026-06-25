export type ServiceStatus = 'normal' | 'intermitente' | 'sin_servicio'
export type HealthStatus  = 'operativo' | 'critico' | 'colapsado'
export type WaterStatus   = 'normal' | 'racionado' | 'sin_servicio'
export type AlertLevel    = 0 | 1 | 2 | 3
export type SourceType    = 'gov' | 'ngo' | 'un' | 'media'
export type OrgType       = 'ngo' | 'gov' | 'un' | 'diaspora'

export interface Region {
  id:               string
  name:             string
  slug:             string
  status_power:     ServiceStatus
  status_internet:  ServiceStatus
  status_health:    HealthStatus
  status_water:     WaterStatus
  alert_level:      AlertLevel
  updated_at:       string
}

export interface Hospital {
  id:                   string
  name:                 string
  city:                 string
  address:              string | null
  phone:                string | null
  region_id:            string | null
  status:               'operativo' | 'parcial' | 'cerrado'
  emergency_available:  boolean
  beds_available:       number | null
  verified:             boolean
  last_updated:         string
  regions?:             Pick<Region, 'name' | 'slug'>
}

export interface Shelter {
  id:               string
  name:             string
  city:             string
  address:          string | null
  phone:            string | null
  contact_name:     string | null
  region_id:        string | null
  capacity:         number | null
  current_occupancy:number
  status:           'activo' | 'lleno' | 'cerrado'
  accepts_pets:     boolean
  verified:         boolean
  last_updated:     string
  regions?:         Pick<Region, 'name' | 'slug'>
}

export interface NewsItem {
  id:          string
  title:       string
  summary:     string | null
  url:         string | null
  source:      string
  source_type: SourceType
  verified:    boolean
  priority:    0 | 1 | 2
  region_id:   string | null
  created_at:  string
  regions?:    Pick<Region, 'name'>
}

export interface Organization {
  id:           string
  name:         string
  description:  string | null
  url:          string | null
  logo_url:     string | null
  type:         OrgType
  country:      string
  donation_url: string | null
  verified:     boolean
  active:       boolean
}
