module.exports = async ({github, context, fs}) => {
  const reviewFile = process.env.REVIEW_FILE;
  if (!reviewFile || !fs.existsSync(reviewFile)) {
      console.log("No review file found.");
      return;
  }

  const reviewContent = fs.readFileSync(reviewFile, 'utf8');
  const jobSummaryUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  
  const commentBody = `
### 🤖 CompPrompt AI Review

The automated agent has analyzed this PR using the [CompPrompt Protocol](https://github.com/cardigan1008/CompPrompt).

\`\`\`markdown
${reviewContent}
\`\`\`

---
**Next Steps:**
- If a test case was generated, check the [Artifacts](${jobSummaryUrl}) section of this run.
- Verify the findings against Alive2 if possible.

*Build ID: ${process.env.GITHUB_RUN_ID}*
`;

  // Output to console instead of posting comment
  console.log("----------------------------------------");
  console.log("Simulated PR Comment Body:");
  console.log(commentBody);
  console.log("----------------------------------------");

  // Post the comment to the PR
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: commentBody
  });

  // Optionally tag the PR
  await github.rest.issues.addLabels({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: ["ai-review-flagged"],
  });

};