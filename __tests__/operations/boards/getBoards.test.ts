import { getBoards } from '../../../src/operations/boards/getBoards';
import { OperationsError } from '../../../src/operations/errors';

const queryRegex = /query \(\$ids: \[Int\]\)/;

describe('getBoards', () => {
  it('calls api with correct query and variables', async () => {
    const api = jest.fn().mockResolvedValue({ boards: [{ id: 1, name: 'b' }] });
    await getBoards(api, { ids: [1] });
    expect(api).toHaveBeenCalledWith(expect.stringMatching(queryRegex), { variables: { ids: [1] } });
  });

  it('throws OperationsError on rejection', async () => {
    const api = jest.fn().mockRejectedValue(new Error('fail'));
    await expect(getBoards(api)).rejects.toBeInstanceOf(OperationsError);
  });
});
