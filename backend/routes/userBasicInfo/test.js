var threeSumClosest = function (nums, target) {
  console.log(findKClosest(nums, 3, target));
  return findKClosest(nums, 3, target);
};

var findKClosest = function (sortedNum, k, target) {
  if (k === sortedNum.length) {
    // console.log(
    //   sortedNum,
    //   k,
    //   target,
    //   sortedNum.reduce((accumulate, current) => {
    //     return accumulate + current;
    //   }, 0)
    // );
    return sortedNum.reduce((accumulate, current) => {
      return accumulate + current;
    }, 0);
  }
  if (k === 1) {
    let smallest = Infinity;
    let the_number = 99999;
    for (let i of sortedNum) {
      if (Math.abs(i - target) < smallest) {
        smallest = Math.abs(i - target);
        the_number = i;
      }
    }
    // console.log(sortedNum, k, target, "return", the_number);
    return the_number;
  }
  let smallest = Infinity;
  let matchest = Infinity;
  for (let i = 0; i < sortedNum.length - 1; i++) {
    let current = sortedNum[i];
    // console.log(current, sortedNum);
    let bestmatch =
      findKClosest(sortedNum.slice(i + 1), k - 1, target - current) + current;
    if (Math.abs(bestmatch - target) < smallest) {
      smallest = Math.abs(bestmatch - target);
      matchest = bestmatch;
      //   console.log("current most match is", matchest, smallest);
    }
  }
  //   console.log(sortedNum, k, target, "return", smallest);
  return matchest;
};

threeSumClosest([4, 0, 5, -5, 3, 3, 0, -4, -5], -2);
// threeSumClosest([1, 1, 1, 1], 2);
