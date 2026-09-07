export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anomalies: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          organization_id: string | null
          severity: string
          source_records: Json
          status: Database["public"]["Enums"]["anomaly_status"]
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          organization_id?: string | null
          severity: string
          source_records: Json
          status?: Database["public"]["Enums"]["anomaly_status"]
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          organization_id?: string | null
          severity?: string
          source_records?: Json
          status?: Database["public"]["Enums"]["anomaly_status"]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anomalies_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          created_at: string
          hardware_id: string
          id: string
          organization_id: string | null
          site_id: string
          status: string
        }
        Insert: {
          created_at?: string
          hardware_id: string
          id?: string
          organization_id?: string | null
          site_id: string
          status?: string
        }
        Update: {
          created_at?: string
          hardware_id?: string
          id?: string
          organization_id?: string | null
          site_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cameras_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      clause_citations: {
        Row: {
          bbox_h: number
          bbox_w: number
          bbox_x: number
          bbox_y: number
          clause_id: string
          id: string
          ocr_confidence: number | null
          organization_id: string
          page_number: number
          source_file_id: string
        }
        Insert: {
          bbox_h: number
          bbox_w: number
          bbox_x: number
          bbox_y: number
          clause_id: string
          id?: string
          ocr_confidence?: number | null
          organization_id: string
          page_number: number
          source_file_id: string
        }
        Update: {
          bbox_h?: number
          bbox_w?: number
          bbox_x?: number
          bbox_y?: number
          clause_id?: string
          id?: string
          ocr_confidence?: number | null
          organization_id?: string
          page_number?: number
          source_file_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clause_citations_clause_id_fkey"
            columns: ["clause_id"]
            isOneToOne: false
            referencedRelation: "contract_clauses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clause_citations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clause_citations_source_file_id_fkey"
            columns: ["source_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      container_calibrations: {
        Row: {
          camera_id: string
          captured_at: string
          captured_by: string | null
          container_id: string
          id: string
          is_active: boolean
          notes: string | null
          organization_id: string
          reference_frame_url: string
          rim_polygon: Json
        }
        Insert: {
          camera_id: string
          captured_at?: string
          captured_by?: string | null
          container_id: string
          id?: string
          is_active?: boolean
          notes?: string | null
          organization_id: string
          reference_frame_url: string
          rim_polygon: Json
        }
        Update: {
          camera_id?: string
          captured_at?: string
          captured_by?: string | null
          container_id?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          organization_id?: string
          reference_frame_url?: string
          rim_polygon?: Json
        }
        Relationships: [
          {
            foreignKeyName: "container_calibrations_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_calibrations_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_calibrations_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "container_calibrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      containers: {
        Row: {
          capacity_cubic_yards: number | null
          created_at: string
          id: string
          organization_id: string | null
          serial_number: string | null
          site_id: string
        }
        Insert: {
          capacity_cubic_yards?: number | null
          created_at?: string
          id?: string
          organization_id?: string | null
          serial_number?: string | null
          site_id: string
        }
        Update: {
          capacity_cubic_yards?: number | null
          created_at?: string
          id?: string
          organization_id?: string | null
          serial_number?: string | null
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "containers_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_clauses: {
        Row: {
          clause_text: string
          clause_type: string
          contract_id: string
          created_at: string
          id: string
          organization_id: string | null
        }
        Insert: {
          clause_text: string
          clause_type: string
          contract_id: string
          created_at?: string
          id?: string
          organization_id?: string | null
        }
        Update: {
          clause_text?: string
          clause_type?: string
          contract_id?: string
          created_at?: string
          id?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_clauses_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_escalation: {
        Row: {
          contract_id: string
          created_at: string
          escalation_date: string
          id: string
          index_type: string | null
          organization_id: string | null
          percentage_increase: number
        }
        Insert: {
          contract_id: string
          created_at?: string
          escalation_date: string
          id?: string
          index_type?: string | null
          organization_id?: string | null
          percentage_increase: number
        }
        Update: {
          contract_id?: string
          created_at?: string
          escalation_date?: string
          id?: string
          index_type?: string | null
          organization_id?: string | null
          percentage_increase?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_escalation_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_fees: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          fee_type: string
          id: string
          is_percentage: boolean
          organization_id: string | null
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          fee_type: string
          id?: string
          is_percentage?: boolean
          organization_id?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          fee_type?: string
          id?: string
          is_percentage?: boolean
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_fees_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_services: {
        Row: {
          base_rate: number
          container_size: string | null
          contract_id: string
          created_at: string
          frequency_per_week: number | null
          id: string
          organization_id: string | null
          service_name: string
        }
        Insert: {
          base_rate: number
          container_size?: string | null
          contract_id: string
          created_at?: string
          frequency_per_week?: number | null
          id?: string
          organization_id?: string | null
          service_name: string
        }
        Update: {
          base_rate?: number
          container_size?: string | null
          contract_id?: string
          created_at?: string
          frequency_per_week?: number | null
          id?: string
          organization_id?: string | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_services_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_id: string
          created_at: string
          hauler_name: string | null
          id: string
          is_active: boolean
          organization_id: string | null
          source_file_id: string | null
          valid_from: string
          valid_to: string | null
          version: number
        }
        Insert: {
          client_id: string
          created_at?: string
          hauler_name?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          source_file_id?: string | null
          valid_from: string
          valid_to?: string | null
          version?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          hauler_name?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          source_file_id?: string | null
          valid_from?: string
          valid_to?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_source_file_id_fkey"
            columns: ["source_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
        ]
      }
      digester_readiness_signals: {
        Row: {
          computed_at: string
          container_utilization_avg: number | null
          contract_days_remaining: number | null
          id: string
          is_ready_for_workstream_i: boolean
          months_of_clean_data: number
          organic_fraction_estimate: number | null
          organization_id: string
          rationale: string | null
          site_id: string
        }
        Insert: {
          computed_at?: string
          container_utilization_avg?: number | null
          contract_days_remaining?: number | null
          id?: string
          is_ready_for_workstream_i?: boolean
          months_of_clean_data: number
          organic_fraction_estimate?: number | null
          organization_id: string
          rationale?: string | null
          site_id: string
        }
        Update: {
          computed_at?: string
          container_utilization_avg?: number | null
          contract_days_remaining?: number | null
          id?: string
          is_ready_for_workstream_i?: boolean
          months_of_clean_data?: number
          organic_fraction_estimate?: number | null
          organization_id?: string
          rationale?: string | null
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "digester_readiness_signals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digester_readiness_signals_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      fill_observations: {
        Row: {
          camera_id: string
          created_at: string
          fill_percentage: number
          id: string
          organization_id: string | null
          timestamp: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          fill_percentage: number
          id?: string
          organization_id?: string | null
          timestamp: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          fill_percentage?: number
          id?: string
          organization_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fill_observations_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
        ]
      }
      fill_observations_y2026: {
        Row: {
          camera_id: string
          created_at: string
          fill_percentage: number
          id: string
          organization_id: string | null
          timestamp: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          fill_percentage: number
          id?: string
          organization_id?: string | null
          timestamp: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          fill_percentage?: number
          id?: string
          organization_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      fill_observations_y2027: {
        Row: {
          camera_id: string
          created_at: string
          fill_percentage: number
          id: string
          organization_id: string | null
          timestamp: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          fill_percentage: number
          id?: string
          organization_id?: string | null
          timestamp: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          fill_percentage?: number
          id?: string
          organization_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      fill_observations_y2028: {
        Row: {
          camera_id: string
          created_at: string
          fill_percentage: number
          id: string
          organization_id: string | null
          timestamp: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          fill_percentage: number
          id?: string
          organization_id?: string | null
          timestamp: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          fill_percentage?: number
          id?: string
          organization_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      fill_observations_y2029: {
        Row: {
          camera_id: string
          created_at: string
          fill_percentage: number
          id: string
          organization_id: string | null
          timestamp: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          fill_percentage: number
          id?: string
          organization_id?: string | null
          timestamp: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          fill_percentage?: number
          id?: string
          organization_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      fuel_index: {
        Row: {
          fetched_at: string
          id: string
          month: string
          price_per_gallon: number
          region_code: string
          source: string
        }
        Insert: {
          fetched_at?: string
          id?: string
          month: string
          price_per_gallon: number
          region_code?: string
          source?: string
        }
        Update: {
          fetched_at?: string
          id?: string
          month?: string
          price_per_gallon?: number
          region_code?: string
          source?: string
        }
        Relationships: []
      }
      invoice_lines: {
        Row: {
          amount: number
          contract_fee_id: string | null
          contract_service_id: string | null
          description: string
          id: string
          invoice_id: string
          is_reconciled: boolean
          line_type: string
          organization_id: string | null
          pickup_event_id: string | null
          pickup_event_timestamp: string | null
        }
        Insert: {
          amount: number
          contract_fee_id?: string | null
          contract_service_id?: string | null
          description: string
          id?: string
          invoice_id: string
          is_reconciled?: boolean
          line_type: string
          organization_id?: string | null
          pickup_event_id?: string | null
          pickup_event_timestamp?: string | null
        }
        Update: {
          amount?: number
          contract_fee_id?: string | null
          contract_service_id?: string | null
          description?: string
          id?: string
          invoice_id?: string
          is_reconciled?: boolean
          line_type?: string
          organization_id?: string | null
          pickup_event_id?: string | null
          pickup_event_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_contract_fee_id_fkey"
            columns: ["contract_fee_id"]
            isOneToOne: false
            referencedRelation: "contract_fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_contract_service_id_fkey"
            columns: ["contract_service_id"]
            isOneToOne: false
            referencedRelation: "contract_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_pickup_fk"
            columns: ["pickup_event_id", "pickup_event_timestamp"]
            isOneToOne: false
            referencedRelation: "pickup_events"
            referencedColumns: ["id", "timestamp"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          client_id: string
          created_at: string
          id: string
          invoice_number: string
          organization_id: string | null
          source_file_id: string | null
          status: string
          total_amount: number
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          client_id: string
          created_at?: string
          id?: string
          invoice_number: string
          organization_id?: string | null
          source_file_id?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          client_id?: string
          created_at?: string
          id?: string
          invoice_number?: string
          organization_id?: string | null
          source_file_id?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_source_file_id_fkey"
            columns: ["source_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
        ]
      }
      letter_revisions: {
        Row: {
          body_markdown: string
          edited_at: string
          edited_by: string | null
          id: string
          is_final: boolean
          letter_id: string
          organization_id: string
          revision_number: number
          snapshot_file_id: string | null
        }
        Insert: {
          body_markdown: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          is_final?: boolean
          letter_id: string
          organization_id: string
          revision_number: number
          snapshot_file_id?: string | null
        }
        Update: {
          body_markdown?: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          is_final?: boolean
          letter_id?: string
          organization_id?: string
          revision_number?: number
          snapshot_file_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "letter_revisions_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letter_revisions_letter_id_fkey"
            columns: ["letter_id"]
            isOneToOne: false
            referencedRelation: "letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letter_revisions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letter_revisions_snapshot_file_id_fkey"
            columns: ["snapshot_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
        ]
      }
      letters: {
        Row: {
          document_file_id: string | null
          document_url: string | null
          generated_at: string
          hauler_responded_at: string | null
          id: string
          organization_id: string | null
          pattern_metadata: Json | null
          sent_at: string | null
          source_anomaly_id: string | null
          status: Database["public"]["Enums"]["letter_status"]
          type: string
        }
        Insert: {
          document_file_id?: string | null
          document_url?: string | null
          generated_at?: string
          hauler_responded_at?: string | null
          id?: string
          organization_id?: string | null
          pattern_metadata?: Json | null
          sent_at?: string | null
          source_anomaly_id?: string | null
          status?: Database["public"]["Enums"]["letter_status"]
          type: string
        }
        Update: {
          document_file_id?: string | null
          document_url?: string | null
          generated_at?: string
          hauler_responded_at?: string | null
          id?: string
          organization_id?: string | null
          pattern_metadata?: Json | null
          sent_at?: string | null
          source_anomaly_id?: string | null
          status?: Database["public"]["Enums"]["letter_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "letters_document_file_id_fkey"
            columns: ["document_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letters_source_anomaly_id_fkey"
            columns: ["source_anomaly_id"]
            isOneToOne: false
            referencedRelation: "anomalies"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          cadence: Database["public"]["Enums"]["notification_cadence"]
          channel: Database["public"]["Enums"]["notification_channel"]
          destination: string | null
          id: string
          organization_id: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cadence: Database["public"]["Enums"]["notification_cadence"]
          channel: Database["public"]["Enums"]["notification_channel"]
          destination?: string | null
          id?: string
          organization_id: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cadence?: Database["public"]["Enums"]["notification_cadence"]
          channel?: Database["public"]["Enums"]["notification_channel"]
          destination?: string | null
          id?: string
          organization_id?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      parsed_contracts: {
        Row: {
          created_at: string
          fields: Json
          file_name: string
          id: string
          source: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          fields: Json
          file_name: string
          id?: string
          source: string
          storage_path: string
        }
        Update: {
          created_at?: string
          fields?: Json
          file_name?: string
          id?: string
          source?: string
          storage_path?: string
        }
        Relationships: []
      }
      pickup_events: {
        Row: {
          bag_count: number | null
          confidence: number | null
          container_id: string
          created_at: string
          id: string
          keyframe_url: string | null
          organization_id: string | null
          post_fill_percent: number | null
          pre_fill_percent: number | null
          timestamp: string
        }
        Insert: {
          bag_count?: number | null
          confidence?: number | null
          container_id: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp: string
        }
        Update: {
          bag_count?: number | null
          confidence?: number | null
          container_id?: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_events_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_events_y2026: {
        Row: {
          bag_count: number | null
          confidence: number | null
          container_id: string
          created_at: string
          id: string
          keyframe_url: string | null
          organization_id: string | null
          post_fill_percent: number | null
          pre_fill_percent: number | null
          timestamp: string
        }
        Insert: {
          bag_count?: number | null
          confidence?: number | null
          container_id: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp: string
        }
        Update: {
          bag_count?: number | null
          confidence?: number | null
          container_id?: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      pickup_events_y2027: {
        Row: {
          bag_count: number | null
          confidence: number | null
          container_id: string
          created_at: string
          id: string
          keyframe_url: string | null
          organization_id: string | null
          post_fill_percent: number | null
          pre_fill_percent: number | null
          timestamp: string
        }
        Insert: {
          bag_count?: number | null
          confidence?: number | null
          container_id: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp: string
        }
        Update: {
          bag_count?: number | null
          confidence?: number | null
          container_id?: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      pickup_events_y2028: {
        Row: {
          bag_count: number | null
          confidence: number | null
          container_id: string
          created_at: string
          id: string
          keyframe_url: string | null
          organization_id: string | null
          post_fill_percent: number | null
          pre_fill_percent: number | null
          timestamp: string
        }
        Insert: {
          bag_count?: number | null
          confidence?: number | null
          container_id: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp: string
        }
        Update: {
          bag_count?: number | null
          confidence?: number | null
          container_id?: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      pickup_events_y2029: {
        Row: {
          bag_count: number | null
          confidence: number | null
          container_id: string
          created_at: string
          id: string
          keyframe_url: string | null
          organization_id: string | null
          post_fill_percent: number | null
          pre_fill_percent: number | null
          timestamp: string
        }
        Insert: {
          bag_count?: number | null
          confidence?: number | null
          container_id: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp: string
        }
        Update: {
          bag_count?: number | null
          confidence?: number | null
          container_id?: string
          created_at?: string
          id?: string
          keyframe_url?: string | null
          organization_id?: string | null
          post_fill_percent?: number | null
          pre_fill_percent?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      raw_files: {
        Row: {
          byte_size: number
          client_id: string | null
          id: string
          kind: Database["public"]["Enums"]["raw_file_kind"]
          mime_type: string
          organization_id: string
          sha256_hex: string
          storage_bucket: string
          storage_path: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          byte_size: number
          client_id?: string | null
          id?: string
          kind: Database["public"]["Enums"]["raw_file_kind"]
          mime_type: string
          organization_id: string
          sha256_hex: string
          storage_bucket: string
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          byte_size?: number
          client_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["raw_file_kind"]
          mime_type?: string
          organization_id?: string
          sha256_hex?: string
          storage_bucket?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raw_files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          confidence: number | null
          container_id: string | null
          created_at: string
          draft_letter_id: string | null
          evidence_anomaly_ids: string[] | null
          evidence_invoice_line_ids: string[] | null
          evidence_pickup_event_ids: string[] | null
          id: string
          kind: Database["public"]["Enums"]["recommendation_kind"]
          organization_id: string
          projected_savings_monthly: number | null
          rationale: string
          resolved_at: string | null
          site_id: string
          status: Database["public"]["Enums"]["recommendation_status"]
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          container_id?: string | null
          created_at?: string
          draft_letter_id?: string | null
          evidence_anomaly_ids?: string[] | null
          evidence_invoice_line_ids?: string[] | null
          evidence_pickup_event_ids?: string[] | null
          id?: string
          kind: Database["public"]["Enums"]["recommendation_kind"]
          organization_id: string
          projected_savings_monthly?: number | null
          rationale: string
          resolved_at?: string | null
          site_id: string
          status?: Database["public"]["Enums"]["recommendation_status"]
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          container_id?: string | null
          created_at?: string
          draft_letter_id?: string | null
          evidence_anomaly_ids?: string[] | null
          evidence_invoice_line_ids?: string[] | null
          evidence_pickup_event_ids?: string[] | null
          id?: string
          kind?: Database["public"]["Enums"]["recommendation_kind"]
          organization_id?: string
          projected_savings_monthly?: number | null
          rationale?: string
          resolved_at?: string | null
          site_id?: string
          status?: Database["public"]["Enums"]["recommendation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_draft_letter_id_fkey"
            columns: ["draft_letter_id"]
            isOneToOne: false
            referencedRelation: "letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_benchmarks: {
        Row: {
          computed_at: string
          computed_for_month: string
          container_size_cy: number
          id: string
          median_value: number
          metric: string
          p25_value: number | null
          p75_value: number | null
          region_code: string
          sample_size: number
        }
        Insert: {
          computed_at?: string
          computed_for_month: string
          container_size_cy: number
          id?: string
          median_value: number
          metric: string
          p25_value?: number | null
          p75_value?: number | null
          region_code: string
          sample_size: number
        }
        Update: {
          computed_at?: string
          computed_for_month?: string
          container_size_cy?: number
          id?: string
          median_value?: number
          metric?: string
          p25_value?: number | null
          p75_value?: number | null
          region_code?: string
          sample_size?: number
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          report_type: Database["public"]["Enums"]["report_type"]
          schema_json: Json
          template_body: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_type: Database["public"]["Enums"]["report_type"]
          schema_json: Json
          template_body: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          report_type?: Database["public"]["Enums"]["report_type"]
          schema_json?: Json
          template_body?: string
          version?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          data_snapshot_hash: string
          document_file_id: string | null
          document_url: string
          id: string
          organization_id: string | null
          recipient_list: Json
          site_id: string
          template_version: string
        }
        Insert: {
          created_at?: string
          data_snapshot_hash: string
          document_file_id?: string | null
          document_url: string
          id?: string
          organization_id?: string | null
          recipient_list: Json
          site_id: string
          template_version: string
        }
        Update: {
          created_at?: string
          data_snapshot_hash?: string
          document_file_id?: string | null
          document_url?: string
          id?: string
          organization_id?: string | null
          recipient_list?: Json
          site_id?: string
          template_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_document_file_id_fkey"
            columns: ["document_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      scale_house_tickets: {
        Row: {
          container_id: string
          gross_weight_lbs: number | null
          hauler_name: string | null
          id: string
          ingested_at: string
          net_weight_lbs: number | null
          organization_id: string
          pickup_event_id: string | null
          pickup_event_timestamp: string | null
          raw_payload: Json | null
          source_file_id: string | null
          tare_weight_lbs: number | null
          ticket_number: string
          weighed_at: string
        }
        Insert: {
          container_id: string
          gross_weight_lbs?: number | null
          hauler_name?: string | null
          id?: string
          ingested_at?: string
          net_weight_lbs?: number | null
          organization_id: string
          pickup_event_id?: string | null
          pickup_event_timestamp?: string | null
          raw_payload?: Json | null
          source_file_id?: string | null
          tare_weight_lbs?: number | null
          ticket_number: string
          weighed_at: string
        }
        Update: {
          container_id?: string
          gross_weight_lbs?: number | null
          hauler_name?: string | null
          id?: string
          ingested_at?: string
          net_weight_lbs?: number | null
          organization_id?: string
          pickup_event_id?: string | null
          pickup_event_timestamp?: string | null
          raw_payload?: Json | null
          source_file_id?: string | null
          tare_weight_lbs?: number | null
          ticket_number?: string
          weighed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scale_house_tickets_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scale_house_tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scale_house_tickets_pickup_event_id_pickup_event_timestamp_fkey"
            columns: ["pickup_event_id", "pickup_event_timestamp"]
            isOneToOne: false
            referencedRelation: "pickup_events"
            referencedColumns: ["id", "timestamp"]
          },
          {
            foreignKeyName: "scale_house_tickets_source_file_id_fkey"
            columns: ["source_file_id"]
            isOneToOne: false
            referencedRelation: "raw_files"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          component_carbon_impact: number | null
          component_cost_efficiency: number | null
          component_diversion_rate: number | null
          id: string
          organization_id: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Insert: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Update: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id?: string
          timestamp?: string
          whes_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "scores_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      scores_y2026: {
        Row: {
          component_carbon_impact: number | null
          component_cost_efficiency: number | null
          component_diversion_rate: number | null
          id: string
          organization_id: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Insert: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Update: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id?: string
          timestamp?: string
          whes_score?: number
        }
        Relationships: []
      }
      scores_y2027: {
        Row: {
          component_carbon_impact: number | null
          component_cost_efficiency: number | null
          component_diversion_rate: number | null
          id: string
          organization_id: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Insert: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Update: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id?: string
          timestamp?: string
          whes_score?: number
        }
        Relationships: []
      }
      scores_y2028: {
        Row: {
          component_carbon_impact: number | null
          component_cost_efficiency: number | null
          component_diversion_rate: number | null
          id: string
          organization_id: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Insert: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Update: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id?: string
          timestamp?: string
          whes_score?: number
        }
        Relationships: []
      }
      scores_y2029: {
        Row: {
          component_carbon_impact: number | null
          component_cost_efficiency: number | null
          component_diversion_rate: number | null
          id: string
          organization_id: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Insert: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id: string
          timestamp: string
          whes_score: number
        }
        Update: {
          component_carbon_impact?: number | null
          component_cost_efficiency?: number | null
          component_diversion_rate?: number | null
          id?: string
          organization_id?: string | null
          site_id?: string
          timestamp?: string
          whes_score?: number
        }
        Relationships: []
      }
      sites: {
        Row: {
          address: string | null
          client_id: string
          created_at: string
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          address?: string | null
          client_id: string
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      staff_access_audit: {
        Row: {
          accessed_at: string
          action: string
          client_id: string | null
          id: number
          ip_address: unknown
          organization_id: string
          request_id: string | null
          resource_id: string | null
          resource_table: string | null
          staff_user_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          client_id?: string | null
          id?: number
          ip_address?: unknown
          organization_id: string
          request_id?: string | null
          resource_id?: string | null
          resource_table?: string | null
          staff_user_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          client_id?: string | null
          id?: number
          ip_address?: unknown
          organization_id?: string
          request_id?: string | null
          resource_id?: string | null
          resource_table?: string | null
          staff_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          emitted_at: string
          event_type: string
          id: string
          organization_id: string | null
          payload: Json
        }
        Insert: {
          emitted_at?: string
          event_type: string
          id?: string
          organization_id?: string | null
          payload: Json
        }
        Update: {
          emitted_at?: string
          event_type?: string
          id?: string
          organization_id?: string | null
          payload?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      webhook_subscriptions: {
        Row: {
          created_at: string
          event_types: Database["public"]["Enums"]["system_event_type"][]
          failure_count: number
          id: string
          is_active: boolean
          last_failure_at: string | null
          last_success_at: string | null
          organization_id: string
          signing_secret: string
          url: string
        }
        Insert: {
          created_at?: string
          event_types: Database["public"]["Enums"]["system_event_type"][]
          failure_count?: number
          id?: string
          is_active?: boolean
          last_failure_at?: string | null
          last_success_at?: string | null
          organization_id: string
          signing_secret: string
          url: string
        }
        Update: {
          created_at?: string
          event_types?: Database["public"]["Enums"]["system_event_type"][]
          failure_count?: number
          id?: string
          is_active?: boolean
          last_failure_at?: string | null
          last_success_at?: string | null
          organization_id?: string
          signing_secret?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      auth_has_role: {
        Args: { p_org: string; p_roles: string[] }
        Returns: boolean
      }
      auth_org_ids: { Args: never; Returns: string[] }
      create_yearly_partitions: { Args: { p_year: number }; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gettransactionid: { Args: never; Returns: unknown }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      snapshot_whes_for_today: { Args: never; Returns: undefined }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      anomaly_severity: "low" | "medium" | "high" | "critical"
      anomaly_status: "open" | "in_review" | "dismissed" | "resolved"
      anomaly_type:
        | "pickup_count_mismatch"
        | "tonnage_variance"
        | "fuel_surcharge_overcharge"
        | "unauthorized_fee"
        | "over_servicing"
        | "under_servicing"
        | "missed_pickup"
        | "overflow"
        | "contamination"
        | "escalation_unjustified"
        | "rate_drift"
        | "other"
      clause_type:
        | "pricing"
        | "base_service"
        | "disposal_rate"
        | "overage_rate"
        | "contamination_rate"
        | "fuel_surcharge"
        | "environmental_fee"
        | "admin_fee"
        | "regulatory_fee"
        | "container_rental"
        | "escalation"
        | "term"
        | "renewal"
        | "auto_renewal"
        | "cancellation"
        | "notice_period"
        | "liability"
        | "indemnification"
        | "arbitration"
        | "other"
      fee_category:
        | "haul"
        | "disposal_tonnage"
        | "base_service"
        | "fuel_surcharge"
        | "environmental_fee"
        | "admin_fee"
        | "container_rental"
        | "overage"
        | "contamination"
        | "lock_bar"
        | "switch_out"
        | "special_charges"
      invoice_status:
        | "unreconciled"
        | "partially_reconciled"
        | "reconciled"
        | "disputed"
        | "paid"
      letter_status: "draft" | "in_review" | "sent" | "responded"
      letter_type:
        | "frequency_reduction"
        | "fee_dispute"
        | "fuel_surcharge_correction"
        | "missed_pickup_credit"
        | "renegotiation_cover"
        | "rfp_package"
        | "other"
      membership_role: "admin" | "member" | "viewer"
      notification_cadence: "immediate" | "daily" | "weekly" | "off"
      notification_channel: "email" | "sms" | "in_app" | "webhook"
      raw_file_kind:
        | "contract"
        | "invoice"
        | "scale_ticket"
        | "letter_sent"
        | "report"
        | "keyframe"
        | "other"
      recommendation_kind:
        | "reduce_frequency"
        | "increase_frequency"
        | "upsize_container"
        | "downsize_container"
        | "add_compactor"
        | "dispute_fee"
        | "renegotiate_contract"
        | "recover_credit"
        | "digester_pitch"
        | "other"
      recommendation_status:
        | "open"
        | "draft_letter_pending"
        | "letter_sent"
        | "accepted"
        | "rejected"
        | "expired"
      report_type:
        | "weekly_digest"
        | "monthly_summary"
        | "quarterly_review"
        | "internal_portfolio"
        | "case_study"
      system_event_type:
        | "pickup.detected"
        | "fill.estimate"
        | "invoice.received"
        | "invoice.parsed"
        | "anomaly.raised"
        | "anomaly.resolved"
        | "letter.drafted"
        | "letter.sent"
        | "letter.responded"
        | "composition.estimate"
        | "report.generated"
        | "contract.parsed"
        | "calibration.captured"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      anomaly_severity: ["low", "medium", "high", "critical"],
      anomaly_status: ["open", "in_review", "dismissed", "resolved"],
      anomaly_type: [
        "pickup_count_mismatch",
        "tonnage_variance",
        "fuel_surcharge_overcharge",
        "unauthorized_fee",
        "over_servicing",
        "under_servicing",
        "missed_pickup",
        "overflow",
        "contamination",
        "escalation_unjustified",
        "rate_drift",
        "other",
      ],
      clause_type: [
        "pricing",
        "base_service",
        "disposal_rate",
        "overage_rate",
        "contamination_rate",
        "fuel_surcharge",
        "environmental_fee",
        "admin_fee",
        "regulatory_fee",
        "container_rental",
        "escalation",
        "term",
        "renewal",
        "auto_renewal",
        "cancellation",
        "notice_period",
        "liability",
        "indemnification",
        "arbitration",
        "other",
      ],
      fee_category: [
        "haul",
        "disposal_tonnage",
        "base_service",
        "fuel_surcharge",
        "environmental_fee",
        "admin_fee",
        "container_rental",
        "overage",
        "contamination",
        "lock_bar",
        "switch_out",
        "special_charges",
      ],
      invoice_status: [
        "unreconciled",
        "partially_reconciled",
        "reconciled",
        "disputed",
        "paid",
      ],
      letter_status: ["draft", "in_review", "sent", "responded"],
      letter_type: [
        "frequency_reduction",
        "fee_dispute",
        "fuel_surcharge_correction",
        "missed_pickup_credit",
        "renegotiation_cover",
        "rfp_package",
        "other",
      ],
      membership_role: ["admin", "member", "viewer"],
      notification_cadence: ["immediate", "daily", "weekly", "off"],
      notification_channel: ["email", "sms", "in_app", "webhook"],
      raw_file_kind: [
        "contract",
        "invoice",
        "scale_ticket",
        "letter_sent",
        "report",
        "keyframe",
        "other",
      ],
      recommendation_kind: [
        "reduce_frequency",
        "increase_frequency",
        "upsize_container",
        "downsize_container",
        "add_compactor",
        "dispute_fee",
        "renegotiate_contract",
        "recover_credit",
        "digester_pitch",
        "other",
      ],
      recommendation_status: [
        "open",
        "draft_letter_pending",
        "letter_sent",
        "accepted",
        "rejected",
        "expired",
      ],
      report_type: [
        "weekly_digest",
        "monthly_summary",
        "quarterly_review",
        "internal_portfolio",
        "case_study",
      ],
      system_event_type: [
        "pickup.detected",
        "fill.estimate",
        "invoice.received",
        "invoice.parsed",
        "anomaly.raised",
        "anomaly.resolved",
        "letter.drafted",
        "letter.sent",
        "letter.responded",
        "composition.estimate",
        "report.generated",
        "contract.parsed",
        "calibration.captured",
      ],
    },
  },
} as const
