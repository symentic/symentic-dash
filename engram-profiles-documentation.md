# Engram Profiles JSON Documentation

## Overview

The Engram Profiles system stores information about individuals, their roles, and associated enrichments (memories, insights, or achievements). This document describes the JSON data format used for storing and exchanging engram profile data.

## Data Structure

### EngramProfile Object

The root object representing a complete profile.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the profile. Can be any unique string (UUID, timestamp, incremental ID) |
| `name` | string | Yes | Full name of the person |
| `role` | string | Yes | Professional role or title |
| `description` | string | Yes | Brief description of the person's expertise and background |
| `tags` | string[] | Yes | Array of categorization tags for filtering and grouping |
| `enrichments` | Enrichment[] | Yes | Array of enrichment objects (can be empty) |

### Enrichment Object

Represents a memory, insight, achievement, or note associated with a profile.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the enrichment |
| `title` | string | Yes | Short, descriptive title for the enrichment |
| `timestamp` | string | Yes | ISO 8601 formatted timestamp (e.g., "2024-03-15T10:30:00Z") |
| `content` | string | Yes | Main content of the enrichment. Supports markdown formatting |

## Supported Markdown in Content

The `content` field in enrichments supports basic markdown:
- **Bold text**: `**text**`
- *Italic text*: `*text*`
- `Code snippets`: `` `code` ``
- Code blocks: ``` ```code block``` ```

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "profiles": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "role", "description", "tags", "enrichments"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier"
          },
          "name": {
            "type": "string",
            "description": "Person's full name"
          },
          "role": {
            "type": "string",
            "description": "Professional role or title"
          },
          "description": {
            "type": "string",
            "description": "Brief description of expertise"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Categorization tags"
          },
          "enrichments": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "title", "timestamp", "content"],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Unique enrichment identifier"
                },
                "title": {
                  "type": "string",
                  "description": "Enrichment title"
                },
                "timestamp": {
                  "type": "string",
                  "format": "date-time",
                  "description": "ISO 8601 timestamp"
                },
                "content": {
                  "type": "string",
                  "description": "Enrichment content with markdown support"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Example Usage

### Single Profile
```json
{
  "id": "prof_001",
  "name": "Jane Doe",
  "role": "Software Engineer",
  "description": "Full-stack developer with expertise in React and Node.js",
  "tags": ["Engineering", "Frontend", "Backend"],
  "enrichments": [
    {
      "id": "enr_001",
      "title": "Project Success",
      "timestamp": "2024-03-28T10:00:00Z",
      "content": "Successfully delivered **Project Phoenix** ahead of schedule"
    }
  ]
}
```

### Multiple Profiles (Collection)
```json
{
  "profiles": [
    {
      "id": "1",
      "name": "Sarah Chen",
      "role": "AI Research Lead",
      "description": "Pioneering researcher in neural architecture search",
      "tags": ["AI", "Research"],
      "enrichments": []
    },
    {
      "id": "2",
      "name": "Marcus Rodriguez",
      "role": "Hardware Engineer",
      "description": "Expert in custom ASIC design",
      "tags": ["Hardware", "ASIC"],
      "enrichments": []
    }
  ]
}
```

## Best Practices

1. **IDs**: Use UUIDs or timestamp-based IDs to ensure uniqueness
2. **Timestamps**: Always use ISO 8601 format with timezone (preferably UTC)
3. **Tags**: Keep tags consistent and lowercase for better filtering
4. **Content**: Use markdown sparingly for emphasis, not for complex formatting
5. **Descriptions**: Keep descriptions concise but informative (50-200 characters)

## Data Validation Rules

- All required fields must be present
- `id` fields must be unique within their scope
- `timestamp` must be valid ISO 8601 format
- `tags` array can be empty but must be present
- `enrichments` array can be empty but must be present
- String fields should be trimmed of leading/trailing whitespace

## Import/Export Considerations

When importing/exporting engram profiles:
1. Validate JSON structure before processing
2. Check for duplicate IDs and handle appropriately
3. Sanitize markdown content to prevent XSS attacks
4. Consider implementing versioning for future format changes
5. Preserve timezone information in timestamps

## Future Enhancements

Potential fields for future versions:
- `version`: Format version number
- `created_at`: Profile creation timestamp
- `updated_at`: Last modification timestamp
- `avatar_url`: Profile picture URL
- `metadata`: Flexible object for additional data
- `status`: Active/Inactive/Archived status