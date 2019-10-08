# Tournament contract functions

To create a tournament with the tournament contract, an admin would have to 
send transactions calling the following functions within the tournament contract:

1.  ```
    createPrizeTable(
        uint256[] memory table
    ) public returns (bytes32)
    ```

    This creates a prize table that can be referenced by using it's unique generated ID
    within the tournament contract. 
    
    An array of numbers indicating % prizes of the total prize pool (minus rake fees)
    is meant to be passed here.
    
    For example, a prize table `[50, 30, 20]` would indicate the first place winner gets
    50%, second 30% and third 20%.
    
    This emits a `LogNewPrizeTable` event with the prize table ID and count as it's params.
    
2. ```
    createTournament(
        uint256 entryFee,
        uint256 entryLimit,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        uint8 prizeType,
        bytes32 prizeTable
    ) public returns (bytes32)
   ```
   
   Creates a tournament which can be referenced by using it's unique generated ID within
   the tournament contract.
   
   The parameters passed are as follows:
   
    1. entryFee - Entry fee in DBETs to enter a tournament
    2. entryLimit - Entry limit for each unique address
    3. minEntries - The minimum number of entries for the tournament
    4. maxEntries - The maximum number of entries for the tournament
    5. rakePercent - Percentage of the prize pool retained by the host
    5. prizeType - Type of prize for tournament - can be STANDARD, WINNER_TAKE_ALL or FIFTY_FIFTY
    5. prizeTable - Unique ID of prize table to be used for the tournament
    
    This emits a `LogNewTournament` event with the tournament ID and count as it's params.
    
3. ```
    createNodeTournament(
        uint256 nodeId,
        uint256 entryFee,
        uint256 entryLimit,
        uint256 minEntries,
        uint256 maxEntries,
        uint256 rakePercent,
        uint8 prizeType,
        bytes32 prizeTable
    ) public returns (bytes32)
   ``` 
   
   Same as `createTournament()` except it assigns the tournament to a node.
   
4. ```
    enterTournament(
        bytes32 id
    ) public returns (bool)
   ```
   
   Allows users to enter a tournament by passing it's unique tournament ID and 
   paying the listed entry fee.
   
   This requires the user to have a balance and allowance of `entryFee` DBETs 
   with the Tournament contract.
   
5. ```
    completeTournament(
        bytes32 id,
        uint256[][] memory finalStandings,
        uint256 uniqueFinalStandings
    ) public returns (bool)
   ```
   
   Completes an active tournament by passing `finalStandings` and `uniqueFinalStandings`
   for the tournament's unique ID.
   
   Tournaments can be cancelled and set to refund mode by passing an empty final standings 
   array which would update the status of the tournament to `FAILED`.
   
   `finalStandings` must be passed as a 2d-array based on the following format:
   
    * 1d index signifies entry index
    * 2d index signifies final standings for entry index
    
    For example, in the case of `[[0, 1], [0, 1], []]` being passed:
    
    * Entry index 0 and 1 share the 0th and 1st positions
    
    In the case of `[[0, 1], [0, 1], [3], [2]]` being passed:
    
    * Entry index 0 and 1 share the 0th and 1st positions
    * Entry index 2 takes the 3rd position
    * Entry index 3 takes the 2nd position
    
    In the case of `[[2], [0], [1], [3], [4]]` being passed:
    
    * Entry index 0 takes the 2nd position
    * Entry index 1 takes the 0th position
    * Entry index 2 takes the 1st position
    * Entry index 3 takes the 3rd position
    * Entry index 4 takes the 4th position
    
    `uniqueFinalStandings` represents the number of unique participants
    in the final standings array.
    
    In the case of `[[0, 1], [0, 1], []]` this would be 2.
    
    In the case of `[[0, 1], [0, 1], [3], [2]]` this would be 4.
    
    In the case of `[[2], [0], [1], [3], [4]]` this would be 5.
    
6. ```
    claimTournamentPrize(
        bytes32 id,
        uint256 entryIndex,
        uint256 finalStandingIndex
    )
    public
    returns (bool)
   ```    

   Allows tournament participants to claim prizes for their entry **and** finalStanding
   for a unique tournament ID.
   
   `entryIndex` here would be the index in the tournaments' entries, while 
   `finalStandingIndex` would be the index in the tournaments' entries final standings.
   
   For example, for `[[0, 1], [0, 1], [3], [2]]`, entry 0 could claim prizes for 
   `entryIndex` 0 and `finalStandingIndex` 0 as well as `entryIndex` 0 and `finalStandingIndex` 1.
   
7. ```
    claimTournamentRefund(
        bytes32 id,
        uint256 entryIndex
    )
    public
    returns (bool)
   ```
   
   Allows tournament participants to claim refunds for tournaments with a status
   of `FAILED` using their entry index.