import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { ok, notFound, serverError } from '../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return notFound('Employee id is required');
  }

  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }),
    );

    if (!result.Item) {
      return notFound('Employee not found');
    }

    return ok({ employee: result.Item });
  } catch (error) {
    console.error('GetEmployee error:', error);
    return serverError('Failed to get employee');
  }
};
