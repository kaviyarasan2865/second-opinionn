export const UserSchema = {
  openapi: '3.0.0',
  info: {
    title: 'User API',
    version: '1.0.0',
    description: 'API for managing users in the system'
  },
  paths: {
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Retrieves a user by their unique identifier',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              description: 'The unique identifier of the user'
            }
          }
        ],
        responses: {
          '200': {
            description: 'User found successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          '400': {
            description: 'Invalid ID provided',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'User ID is required'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'User not found'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Internal Server Error'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'The unique identifier of the user'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'The email address of the user'
          },
          role: {
            type: 'string',
            enum: ['patient', 'doctor'],
            description: 'The role of the user in the system'
          },
          speciality: {
            type: 'string',
            description: 'The medical speciality of the doctor (only for doctor role)',
            nullable: true
          },
          experience: {
            type: 'number',
            description: 'Years of experience (only for doctor role)',
            nullable: true
          },
          availability: {
            type: 'array',
            description: 'Available time slots (only for doctor role)',
            items: {
              $ref: '#/components/schemas/Availability'
            },
            nullable: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the user was last updated'
          }
        },
        required: ['email', 'role']
      },
      Availability: {
        type: 'object',
        properties: {
          day: {
            type: 'string',
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            description: 'Day of the week'
          },
          slots: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Slot'
            },
            description: 'Available time slots for the day'
          }
        },
        required: ['day', 'slots']
      },
      Slot: {
        type: 'object',
        properties: {
          start: {
            type: 'string',
            format: 'time',
            description: 'Start time of the slot (HH:mm format)'
          },
          end: {
            type: 'string',
            format: 'time',
            description: 'End time of the slot (HH:mm format)'
          }
        },
        required: ['start', 'end']
      }
    }
  }
}; 