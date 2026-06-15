import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import { badRequest, noContent, notFound, serverError } from '../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return badRequest('Employee id is required');
  }

  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
        ConditionExpression: 'attribute_exists(id)',
      }),
    );

    return noContent();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ConditionalCheckFailedException') {
      return notFound('Employee not found');
    }
    console.error('DeleteEmployee error:', error);
    return serverError('Failed to delete employee');
  }
};
