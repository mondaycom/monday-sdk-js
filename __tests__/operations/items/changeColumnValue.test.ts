import { changeColumnValue } from '../../../src/operations/items/changeColumnValue';
import { OperationsError } from '../../../src/operations/errors';

describe('changeColumnValue', () => {
  it('sends correct mutation with variables', async () => {
    const api = jest.fn().mockResolvedValue({ change_column_value: { id: 3 } });
    await changeColumnValue(api, 1, 'text', 'val');
    expect(api).toHaveBeenCalledWith(expect.stringContaining('change_column_value'), {
      variables: { itemId: 1, columnId: 'text', value: 'val' },
    });
  });

  it('throws OperationsError on rejection', async () => {
    const api = jest.fn().mockRejectedValue(new Error('fail'));
    await expect(changeColumnValue(api, 1, 'c', 'v')).rejects.toBeInstanceOf(OperationsError);
  });
});
