import { createItem } from '../../../src/operations/items/createItem';
import { OperationsError } from '../../../src/operations/errors';

describe('createItem', () => {
  it('sends correct mutation and variables', async () => {
    const api = jest.fn().mockResolvedValue({ create_item: { id: 1 } });
    await createItem(api, 1, 'g1', 'Item', { text: 't' });
    expect(api).toHaveBeenCalledWith(expect.stringContaining('mutation'), {
      variables: {
        boardId: 1,
        groupId: 'g1',
        itemName: 'Item',
        columnValues: JSON.stringify({ text: 't' }),
      },
    });
  });

  it('throws OperationsError on failure', async () => {
    const api = jest.fn().mockRejectedValue(new Error('err'));
    await expect(createItem(api, 1, undefined, 'name')).rejects.toBeInstanceOf(OperationsError);
  });
});
