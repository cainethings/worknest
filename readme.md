# Compass Repository

Welcome to the **Compass** repository! This README provides detailed instructions to help team members work through the repo, maintain code quality, and adhere to standards. Please read carefully before contributing.

## Repository Details
- **Production Branch:** `publish`
- **Release Branch:** `dev`
- **Staging Branch:** `stage-compass`

### Demo Pages
- **DEMO PAGE 1:** [https://stage-compass.cainethings.com/demo-page-1](https://stage-compass.cainethings.com/demo-page-1)
- **DEMO PAGE 2:** [https://stage-compass.cainethings.com/dwemo-page-2](https://stage-compass.cainethings.com/dwemo-page-2)

## Route of Code to Production
1. **Publish Branch:** `publish` is the branch that will be hosted on the main website.
2. **Finalized Code:** Finalized `dev` code is merged into `publish` when it is ready.
3. **Feature Development:** Developers should create a branch from `dev` and merge it back into `dev` after completing their changes.
4. **Staging Changes:** To stage a change:
   - Merge the feature branch into `dev`.
   - Merge `dev` into `stage-compass`.
5. **Publishing Schedule:** Publishing happens only on planned days.

## Branching Strategy
### Creating a Feature Branch
1. Switch to the `dev` branch:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b [feature-branch-name]
   ```
2. Perform your changes locally.

3. Check your changes:
   ```bash
   git status
   git add .
   git commit -m "commit comment"
   git push origin [feature-branch-name]
   ```

4. Visit your branch's compare page to create a pull request:
   [Compare Page](https://github.com/cainethings/compass/compare/[feature-branch-name]?expand=1)

5. Self-merge your pull request into `dev`.

### Merging to Staging
1. Pull the latest changes:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout stage-compass
   git pull origin stage-compass
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Merge the `dev` branch into `stage-compass`:
   ```bash
   git merge -X theirs dev
   git push origin stage-compass
   ```

## Useful Links
- **Project Status:** [Asana Link](https://app.asana.com/0/1209147593920669/1209147802318551)
- **Live URL:** https://compass.cainethings.com
- **Stage URL:** https://stage-compass.cainethings.com

## Simplified Git Process
To streamline the workflow, follow these steps:
1. Always start by pulling the latest changes from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. Create a feature branch:
   ```bash
   git checkout -b [feature-branch-name]
   ```
3. After making changes, commit and push:
   ```bash
   git add .
   git commit -m "commit message"
   git push origin [feature-branch-name]
   ```
4. Create a pull request from your feature branch to `dev` and self-merge.
5. If staging is required, merge `dev` into `stage-compass` and test thoroughly.

## Contribution Guidelines
1. Always create a feature branch for changes. Avoid pushing directly to `dev` or `stage-compass`.
2. Ensure your code is properly formatted and follows the project's coding standards.
3. Before creating a pull request, ensure:
   - Code has been tested locally.
   - There are no conflicts with the `dev` branch.
4. Include meaningful commit messages describing the changes made.

## Maintaining Code Sanity
- **Consistent Naming:** Use clear and consistent branch and file naming conventions.
- **Testing:** Test all changes thoroughly in the `stage-compass` environment before merging to `publish`.
- **Documentation:** Update relevant documentation or comments when introducing new functionality.
- **Peer Review:** Perform code reviews for significant changes before merging.

By following these guidelines, we ensure smooth collaboration and maintain the quality and sanity of the codebase.

---

Feel free to reach out to the team lead or project manager for any clarifications or issues.

