import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN || undefined,
  },
});

const dynamoDbClient = DynamoDBDocumentClient.from(client);

export interface EngramProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  enrichments: Array<{
    id: string;
    title: string;
    timestamp: string;
    content: string;
  }>;
}

export const dynamoDbService = {
  async getProfile(id: string): Promise<EngramProfile | null> {
    try {
      const command = new GetCommand({
        TableName: "engram-profiles",
        Key: {
          "engram-key": id,
        },
      });

      const response = await dynamoDbClient.send(command);
      
      if (response.Item) {
        const { "engram-key": _, ...profileData } = response.Item;
        return {
          ...profileData,
          id: response.Item["engram-key"],
        } as EngramProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  async queryProfiles(id?: string): Promise<EngramProfile[]> {
    try {
      if (id) {
        const profile = await this.getProfile(id);
        return profile ? [profile] : [];
      }

      // Scan all profiles from the table
      const command = new ScanCommand({
        TableName: "engram-profiles",
      });

      const response = await dynamoDbClient.send(command);
      
      if (response.Items && response.Items.length > 0) {
        return response.Items.map(item => {
          const { "engram-key": _, ...profileData } = item;
          return {
            ...profileData,
            id: item["engram-key"],
          } as EngramProfile;
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error querying profiles:", error);
      return [];
    }
  },

  async createProfile(profile: Omit<EngramProfile, "id">): Promise<EngramProfile> {
    const newProfile: EngramProfile = {
      ...profile,
      id: Date.now().toString(),
    };

    try {
      const command = new PutCommand({
        TableName: "engram-profiles",
        Item: {
          "engram-key": newProfile.id,
          ...newProfile,
        },
      });

      await dynamoDbClient.send(command);
      return newProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  async updateProfile(id: string, updates: Partial<EngramProfile>): Promise<EngramProfile | null> {
    try {
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== "id" && key !== "engram-key") {
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      });

      if (updateExpressions.length === 0) {
        return await this.getProfile(id);
      }

      console.log("DynamoDB Update Command:", {
        TableName: "engram-profiles",
        Key: { "engram-key": id },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      const command = new UpdateCommand({
        TableName: "engram-profiles",
        Key: {
          "engram-key": id,
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });

      const response = await dynamoDbClient.send(command);
      console.log("DynamoDB Update Response:", response);
      
      // Map the response back to the expected format
      if (response.Attributes) {
        const { "engram-key": _, ...profileData } = response.Attributes;
        return {
          ...profileData,
          id: response.Attributes["engram-key"],
        } as EngramProfile;
      }
      return null;
    } catch (error) {
      console.error("Error updating profile - Full details:", error);
      throw error; // Re-throw to get better error message in the UI
    }
  },

  async deleteProfile(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: "engram-profiles",
        Key: {
          "engram-key": id,
        },
      });

      await dynamoDbClient.send(command);
      return true;
    } catch (error) {
      console.error("Error deleting profile:", error);
      return false;
    }
  },
};