import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { ok, serverError } from '../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      }),
    );

    const employees = (result.Items ?? []).sort((a, b) =>
      String(a.lastName).localeCompare(String(b.lastName)),
    );

    return ok({ employees, count: employees.length });
  } catch (error) {
    console.error('ListEmployees error:', error);
    return serverError('Failed to list employees');
  }
};
