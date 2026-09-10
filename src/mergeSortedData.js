/**
 * Merges two sorted datasets into the primary dataset in-place.
 *
 * The primary dataset must contain enough empty space at the end
 * to store all elements from the incoming dataset.
 *
 * @param {number[]} primaryData - Destination array.
 * @param {number} primaryCount - Number of valid elements in primaryData.
 * @param {number[]} incomingData - Sorted dataset to merge.
 * @param {number} incomingCount - Number of elements in incomingData.
 */
function mergeSortedData(
    primaryData,
    primaryCount,
    incomingData,
    incomingCount
) {
    // Start at the last valid element of each dataset.
    let leftIndex = primaryCount - 1;
    let rightIndex = incomingCount - 1;

    // Start writing from the last available position.
    let writeIndex = primaryCount + incomingCount - 1;

    // Continue until every incoming element has been placed.
    while (rightIndex >= 0) {
        if (
            leftIndex >= 0 &&
            primaryData[leftIndex] > incomingData[rightIndex]
        ) {
            // Move the larger primary value into its final position.
            primaryData[writeIndex] = primaryData[leftIndex];
            leftIndex--;
        } else {
            // Move the incoming value into its final position.
            primaryData[writeIndex] = incomingData[rightIndex];
            rightIndex--;
        }

        // Move to the next position from right to left.
        writeIndex--;
    }
}

module.exports = mergeSortedData;
