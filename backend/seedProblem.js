// edtech-backend/seedProblems.js
require("dotenv").config();

const mongoose = require("mongoose");
const CodingProblem = require("./models/CodingProblem");

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected for seeding coding problems!");

    // Clear existing coding problems (optional, but good for fresh starts)
    console.log("Clearing existing coding problems...");
    await CodingProblem.deleteMany({});
    console.log("Existing coding problems cleared.");

    const dummyProblems = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        topic: "Arrays",
        level: "Beginner",
        example_input: "nums = [2,7,11,15], target = 9",
        example_output: "[0,1]",
        solutions: [
          {
            language: "python",
            code: `def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i\n    return []`,
          },
          {
            language: "java",
            code: `import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> hashmap = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (hashmap.containsKey(complement)) {\n                return new int[]{hashmap.get(complement), i};\n            }\n            hashmap.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
          },
          {
            language: "c",
            code: `#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    int* result = (int*)malloc(2 * sizeof(int));\n    *returnSize = 0;\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                *returnSize = 2;\n                return result;\n            }\n        }\n    }\n    return result;\n}`,
          },
          {
            language: "cpp",
            code: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int, int> numMap;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (numMap.count(complement)) {\n                return {numMap[complement], i};\n            }\n            numMap[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
          },
        ],
        test_cases: [
          { input: "nums = [2,7,11,15], target = 9", expected_output: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", expected_output: "[1,2]" },
        ],
      },
      {
        title: "Maximum Depth of Binary Tree",
        description:
          "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        topic: "Trees",
        level: "Beginner",
        example_input: "root = [3,9,20,null,null,15,7]",
        example_output: "3",
        solutions: [
          {
            language: "python",
            code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
          },
          {
            language: "java",
            code: `class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) {\n            return 0;\n        }\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
          },
          {
            language: "c",
            code: `struct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\n\nint maxDepth(struct TreeNode* root) {\n    if (root == NULL) {\n        return 0;\n    }\n    int leftDepth = maxDepth(root->left);\n    int rightDepth = maxDepth(root->right);\n    return (leftDepth > rightDepth ? leftDepth : rightDepth) + 1;\n}`,
          },
          {
            language: "cpp",
            code: `struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};\n\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (root == nullptr) {\n            return 0;\n        }\n        return 1 + std::max(maxDepth(root->left), maxDepth(root->right));\n    }\n};`,
          },
        ],
        test_cases: [
          { input: "root = [3,9,20,null,null,15,7]", expected_output: "3" },
          { input: "root = [1,null,2]", expected_output: "2" },
        ],
      },
      {
        title: "Reverse Linked List",
        description:
          "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
        topic: "Linked Lists",
        level: "Intermediate",
        example_input: "head = [1,2,3,4,5]",
        example_output: "[5,4,3,2,1]",
        solutions: [
          {
            language: "python",
            code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev`,
          },
          {
            language: "java",
            code: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}`,
          },
          {
            language: "c",
            code: `struct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL;\n    struct ListNode *curr = head;\n    while (curr != NULL) {\n        struct ListNode *nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
          },
          {
            language: "cpp",
            code: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n    ListNode(int x, ListNode *next) : val(x), next(next) {}\n};\n\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr != nullptr) {\n            ListNode* nextTemp = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n};`,
          },
        ],
        test_cases: [
          { input: "head = [1,2,3,4,5]", expected_output: "[5,4,3,2,1]" },
          { input: "head = [1,2]", expected_output: "[2,1]" },
        ],
      },
    ];

    await CodingProblem.insertMany(dummyProblems);
    console.log("Coding problems seeded successfully!");
  })
  .catch((err) =>
    console.error("MongoDB connection error during seeding:", err)
  )
  .finally(() => {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
});
