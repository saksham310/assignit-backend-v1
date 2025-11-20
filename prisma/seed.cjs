const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Helper to create dates in the past for a realistic timeline
const pastDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
};

// --- RICH, DETAILED, AND PROFESSIONAL TASK & COMMENT POOLS ---
const realisticTasks = {
    backend: [
        {
            name: "[FEAT] JWT Authentication with Refresh Tokens",
            description: `
<h3><strong>User Story:</strong></h3>
<p>As an authenticated API user, I want to log in securely and receive an access token along with a refresh token, so that I can maintain a persistent session without repeatedly entering my password. The system should support token expiry, revocation, and refresh seamlessly, ensuring high security for all endpoints.</p>
<h3><strong>Acceptance Criteria:</strong></h3>
<ul>
  <li><code>/api/auth/register</code> endpoint validates all user inputs and creates a secure hashed password record.</li>
  <li><code>/api/auth/login</code> returns a JSON payload containing a JWT access token valid for 15 minutes, and sets an HTTP-only refresh token cookie valid for 7 days.</li>
  <li>Protected route <code>/api/me</code> must return authenticated user data only when a valid token is provided.</li>
  <li><code>/api/auth/refresh</code> endpoint accepts a valid refresh token and returns a new access token without requiring password input.</li>
  <li>All token failures are logged, with clear error messages for unauthorized access.</li>
</ul>
<h3><strong>Technical Notes:</strong></h3>
<p>Use <code>bcrypt</code> for password hashing, <code>jsonwebtoken</code> for token generation. Refresh tokens should be stored in a secure database table with revocation support. Include proper middleware for role-based access control.</p>`
        },
        {
            name: "[FEAT] Workspace CRUD API",
            description: `
<h3><strong>User Story:</strong></h3>
<p>As a workspace owner or member, I want to create, read, update, and delete workspaces, so that I can organize projects logically and manage user access efficiently.</p>
<h3><strong>Acceptance Criteria:</strong></h3>
<ul>
  <li>Authenticated users can create new workspaces with unique names and invite codes.</li>
  <li>Only 'Owner' or 'Admin' can update or delete the workspace.</li>
  <li>Workspace listing supports pagination, sorting, and filtering by member count or activity status.</li>
  <li>Soft-delete mechanism for safety: deleted workspaces can be restored within 7 days.</li>
</ul>
<h3><strong>Technical Notes:</strong></h3>
<p>Ensure relational integrity for projects and users. Use Prisma transactions for critical operations. Implement audit logging for workspace creation, updates, and deletions.</p>`
        },
        {
            name: "[BUG] N+1 Query on Project List",
            description: `
<h3><strong>Problem:</strong></h3>
<p>The <code>/api/projects</code> endpoint is querying the database for every associated user per project, causing exponential query growth and latency spikes (up to 2–3 seconds for 10 projects).</p>
<h3><strong>Solution:</strong></h3>
<ul>
  <li>Refactor Prisma queries to use <code>include</code> or <code>select</code> to eager-load all related user data efficiently.</li>
  <li>Test with 50+ projects to ensure response time remains < 300ms.</li>
  <li>Update automated tests to check that no extra queries are executed.</li>
</ul>
<h3><strong>Technical Notes:</strong></h3>
<p>Consider caching commonly accessed project lists using Redis or in-memory caching. Monitor database query performance with Prisma logging enabled.</p>`
        },
        {
            name: "[CHORE] CI/CD Pipeline Setup",
            description: `
<h3><strong>Task:</strong></h3>
<p>Setup a fully automated CI/CD workflow using GitHub Actions to ensure code quality, automated testing, containerization, and deployment to staging environment.</p>
<h3><strong>Requirements:</strong></h3>
<ul>
  <li>Run unit tests, linting, and TypeScript checks on every push.</li>
  <li>Build Docker image and push to container registry.</li>
  <li>Deploy backend service automatically to staging (Render.com) when <code>develop</code> branch is updated.</li>
  <li>Include rollback mechanism for failed deployments.</li>
</ul>
<h3><strong>Technical Notes:</strong></h3>
<p>Integrate notifications on Slack for build status and errors. Use environment secrets for DB credentials and API keys.</p>`
        }
    ],
    frontend: [
        {
            name: "[FEAT] Reusable Data Table Component",
            description: `
<h3><strong>User Story:</strong></h3>
<p>As a frontend developer, I want a generic, type-safe React/TypeScript data table component that can render any dataset, with configurable columns, sorting, filtering, and pagination, so that I can rapidly build feature pages without reinventing the table component.</p>
<h3><strong>Technical Requirements:</strong></h3>
<ul>
  <li>Built using React with TypeScript generics (<code>&lt;T&gt;</code>) for full type safety.</li>
  <li>Supports nested data access (e.g., <code>user.address.city</code>).</li>
  <li>Column sorting, filtering, and pagination built-in.</li>
  <li>Optimized for performance with large datasets using memoization.</li>
</ul>
<h3><strong>Notes:</strong></h3>
<p>Include unit tests with React Testing Library and Storybook stories to illustrate functionality. Allow customization of row actions and conditional formatting.</p>`
        },
        {
            name: "[FEAT] Kanban Board with Drag & Drop",
            description: `
<h3><strong>User Story:</strong></h3>
<p>As a PM, I want a visual Kanban board where tasks can be dragged between columns, so that progress tracking is intuitive and updates are reflected immediately in the backend.</p>
<h3><strong>Technical Requirements:</strong></h3>
<ul>
  <li>Use <code>dnd-kit</code> or similar library for drag-and-drop functionality.</li>
  <li>Optimistic UI updates; revert on backend failure.</li>
  <li>Support multiple assignees, labels, due dates, and priorities per task.</li>
  <li>Persist task position and column data in the backend.</li>
</ul>
<h3><strong>Notes:</strong></h3>
<p>Ensure accessibility for keyboard and screen reader users. Include smooth animations for moving tasks.</p>`
        },
        {
            name: "[BUG] Task Modal ESC Key",
            description: `
<h3><strong>Steps to Reproduce:</strong></h3>
<ol>
  <li>Open any task detail modal.</li>
  <li>Press the 'Escape' key.</li>
</ol>
<h3><strong>Expected Behavior:</strong></h3>
<p>The modal should close immediately.</p>
<h3><strong>Actual Behavior:</strong></h3>
<p>Nothing happens. Event listener likely not cleaned up on component unmount.</p>
<h3><strong>Fix:</strong></h3>
<p>Ensure <code>useEffect</code> cleanup removes ESC key listener properly. Test for multiple modals opened consecutively.</p>`
        },
        {
            name: "[DESIGN] High-Fidelity Analytics Mockups",
            description: `
<p>Create Figma mockups for role-based analytics dashboards (PM, Developer, QA), including:</p>
<ul>
  <li>Charts, KPIs, and tables for all key metrics.</li>
  <li>Responsive designs for web and tablet screens.</li>
  <li>Include tooltips, filtering, and drill-down interactions.</li>
  <li>Consistent with design system colors, typography, and spacing.</li>
</ul>
<p>Notes: Provide clear design handoff assets, including export-ready SVGs and component specs.</p>`
        }
    ]
};

const realisticComments = {
    pm: [
        "What's the status on this? This is a critical feature for the Q3 launch.",
        "This is blocked. We're waiting on the final API spec for the third-party integration from the client. I'll follow up with them.",
        "The new designs from @maria.g look fantastic! The frontend team is ready to start implementation.",
        "Let's make sure the acceptance criteria for this are crystal clear before we move it to 'To Do'."
    ],
    dev: [
        "PR is up for review: `feat/jwt-auth-flow-123`. @kenji.t can you take a look?",
        "Okay, I've pushed a fix for the N+1 query. The endpoint is now down to 3 queries instead of 50. Ready for re-testing @anita.r.",
        "The logic here is more complex than we thought. The state management for the drag-and-drop is tricky. I might need to pair with @leo.m on this tomorrow.",
        "Just a heads up, the library we're using for this has a known memory leak issue in v2.1. I'm implementing a workaround for now but we should plan to upgrade."
    ],
    qa: [
        "@kenji.t I've pushed the fix for this bug to the staging environment. It's ready for you to QA.",
        "Found a related bug while working on this. Creating a new ticket. See #TASK-481. This is a high-priority blocker.",
        "QA passed on staging. All acceptance criteria met. Moving this to 'Done'. Great work team!",
        "I've been able to reproduce this bug on my local machine. The issue seems to be in the `UserService.ts` file when handling null values."
    ],
};

const realisticRetrospectives = [
    { wentWell: 'The team did an incredible job tackling the performance issues. The app feels significantly faster now. Great work by @david.c and @kenji.t.', toImprove: 'We had some scope creep. The Redis caching task was bigger than we estimated, which pushed another task to the next sprint.', actionItems: 'For any new tech integration (like caching), we must create a dedicated technical spike/research task in a prior sprint. - @saksham' },
    { wentWell: 'Team alignment was excellent, leading to high-quality feature delivery. The daily stand-ups were very effective.', toImprove: 'We need to improve our task estimation. Several tasks spilled over into the next sprint due to underestimation.', actionItems: 'For the next sprint planning, we will use planning poker and break down any task estimated at more than 3 story points into smaller subtasks.' },
    { wentWell: 'Team communication was excellent, especially in identifying and resolving the cascade delete bug quickly. Incredible work by @anita.r.', toImprove: 'Some tasks were not clearly defined, leading to rework.', actionItems: 'All tasks must have clear acceptance criteria written by the PM before a sprint begins.' },
    { wentWell: 'The new CI/CD pipeline set up by @david.c is a game-changer. Deployments to staging are now seamless.', toImprove: 'The frontend and backend teams had some integration issues due to a mismatched API contract.', actionItems: 'The backend team must publish the OpenAPI spec before the frontend team begins implementation on a new feature.' },
];


async function main() {
    console.log("🔥 Initiating Definitive, Hyper-Realistic Seed Protocol...");

    // --- CLEANUP ---
    await prisma.sprint_Feedback.deleteMany({});
    await prisma.task_Comment.deleteMany({});
    await prisma.task_User.deleteMany({});
    await prisma.tasks.deleteMany({});
    await prisma.sprint.deleteMany({});
    await prisma.status.deleteMany({});
    await prisma.project_User.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.workspace_User.deleteMany({});
    await prisma.workspace.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("🧼 Database sanitized. Ready for a new timeline.");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // --- 1. THE TEAM ---
    const usersData = [ { email: 'sakshams982@gmail.com', username: 'saksham', password: hashedPassword, avatarColor: '#3b82f6' }, { email: 'elena.vostrov@acme.dev', username: 'elena.v', password: hashedPassword, avatarColor: '#8b5cf6' }, { email: 'kenji.tanaka@acme.dev', username: 'kenji.t', password: hashedPassword, avatarColor: '#10b981' }, { email: 'maria.garcia@acme.dev', username: 'maria.g', password: hashedPassword, avatarColor: '#ef4444' }, { email: 'david.chen@acme.dev', username: 'david.c', password: hashedPassword, avatarColor: '#f97316' }, { email: 'anita.rai@acme.dev', username: 'anita.r', password: hashedPassword, avatarColor: '#14b8a6' }, { email: 'leo.ming@acme.dev', username: 'leo.m', password: hashedPassword, avatarColor: '#6366f1' }, { email: 'chandra.gupta@acme.dev', username: 'chandra.g', password: hashedPassword, avatarColor: '#f59e0b' }, { email: 'susan.b@acme.dev', username: 'susan.b', password: hashedPassword, avatarColor: '#ec4899' }, { email: 'omar.k@acme.dev', username: 'omar.k', password: hashedPassword, avatarColor: '#06b6d4' }, { email: 'aisha.n@acme.dev', username: 'aisha.n', password: hashedPassword, avatarColor: '#d946ef' }, { email: 'tom.w@acme.dev', username: 'tom.w', password: hashedPassword, avatarColor: '#78716c' }, ];
    await prisma.user.createMany({ data: usersData });
    const userList = await prisma.user.findMany();
    const userMap = userList.reduce((acc, user) => { acc[user.username] = user; return acc; }, {});
    console.log(`👤 The 'ACME Innovations' team has been assembled (${userList.length} members).`);

    // --- 2. WORKSPACE & PROJECTS ---
    const workspace = await prisma.workspace.create({ data: { name: 'ACME Innovations R&D', inviteCode: 'ACME_INNOVATE' } });
    await prisma.workspace_User.createMany({ data: userList.map((user, i) => ({ workspace_id: workspace.id, user_id: user.id, role: i < 3 ? 'Admin' : 'Member' })) });
    const projectAPI = await prisma.project.create({ data: { name: 'TaskMaster SaaS API', workspace_id: workspace.id, startDate: pastDate(90), dueDate: pastDate(-30), idealTaskCount: 5 } });
    const projectFE = await prisma.project.create({ data: { name: 'Customer Insights Platform', workspace_id: workspace.id, startDate: pastDate(75), dueDate: pastDate(-45), idealTaskCount: 4 } });
    const projectUsers = [ { project_id: projectAPI.id, user_id: userMap['saksham'].id, role: 'Project_Manager' }, { project_id: projectAPI.id, user_id: userMap['kenji.t'].id, role: 'Team_Lead' }, { project_id: projectAPI.id, user_id: userMap['david.c'].id, role: 'Developer' }, { project_id: projectAPI.id, user_id: userMap['chandra.g'].id, role: 'Developer' }, { project_id: projectAPI.id, user_id: userMap['anita.r'].id, role: 'QA' }, { project_id: projectAPI.id, user_id: userMap['susan.b'].id, role: 'Database' }, { project_id: projectFE.id, user_id: userMap['elena.v'].id, role: 'Project_Manager' }, { project_id: projectFE.id, user_id: userMap['saksham'].id, role: 'Developer' }, { project_id: projectFE.id, user_id: userMap['leo.m'].id, role: 'Developer' }, { project_id: projectFE.id, user_id: userMap['maria.g'].id, role: 'Designer' }, { project_id: projectFE.id, user_id: userMap['anita.r'].id, role: 'QA' }, { project_id: projectFE.id, user_id: userMap['tom.w'].id, role: 'Developer' }, ];
    await prisma.project_User.createMany({ data: projectUsers });
    console.log("🚀 Two core SaaS products initiated.");

    // --- 3. STATUSES ---
    await prisma.status.createMany({ data: [ { name: 'Backlog', type: 'To_Do', color: '#6b7280', project_id: projectAPI.id }, { name: 'To Do', type: 'In_Progress', color: '#3b82f6', project_id: projectAPI.id }, { name: 'In Progress', type: 'In_Progress', color: '#f97316', project_id: projectAPI.id }, { name: 'Blocked', type: 'In_Progress', color: '#ef4444', project_id: projectAPI.id }, { name: 'Ready for QA', type: 'In_Progress', color: '#8b5cf6', project_id: projectAPI.id }, { name: 'Done', type: 'Completed', color: '#10b981', project_id: projectAPI.id }, { name: 'Backlog', type: 'To_Do', color: '#6b7280', project_id: projectFE.id }, { name: 'Design', type: 'In_Progress', color: '#a855f7', project_id: projectFE.id }, { name: 'Development', type: 'In_Progress', color: '#3b82f6', project_id: projectFE.id }, { name: 'Testing', type: 'In_Progress', color: '#f59e0b', project_id: projectFE.id }, { name: 'Completed', type: 'Completed', color: '#10b981', project_id: projectFE.id }, ] });
    const statusMap = (await prisma.status.findMany()).reduce((acc, s) => { acc[`${s.project_id}-${s.name}`] = s; return acc; }, {});
    console.log("🚦 Workflow statuses are live.");

    // --- 4. SPRINTS ---
    const sprints = [];
    for (let i = 5; i > 0; i--) { // 5 completed sprints for each project
        sprints.push(await prisma.sprint.create({ data: { name: `Sprint ${6-i}`, project_id: projectAPI.id, startDate: pastDate(15 * i), endDate: pastDate(15 * (i-1) + 1) } }));
        sprints.push(await prisma.sprint.create({ data: { name: `Sprint ${6-i}`, project_id: projectFE.id, startDate: pastDate(15 * i - 7), endDate: pastDate(15 * (i-1) - 6) } }));
    }
    const activeApiSprint = await prisma.sprint.create({ data: { name: 'Sprint 7', project_id: projectAPI.id, startDate: new Date(), endDate: pastDate(-14) } });
    const activeFeSprint = await prisma.sprint.create({ data: { name: 'Sprint 7', project_id: projectFE.id, startDate: new Date(), endDate: pastDate(-14) } });
    console.log("🏃 A 3-month history of sprints has been established.");

    // --- 5. TASKS ---
    const allSprints = await prisma.sprint.findMany();
    let totalTasks = 0;
    for (const sprint of allSprints) {
        const isApi = sprint.project_id === projectAPI.id;
        const taskPool = isApi ? realisticTasks.backend : realisticTasks.frontend;
        const taskCount = Math.floor(Math.random() * 4) + 12; // 12-15 tasks per sprint
        for (let i = 0; i < taskCount; i++) {
            const isBug = Math.random() > 0.8;
            const taskTemplate = taskPool[Math.floor(Math.random() * taskPool.length)];
            const statusPool = isApi ? [statusMap[`${projectAPI.id}-To Do`], statusMap[`${projectAPI.id}-In Progress`], statusMap[`${projectAPI.id}-Ready for QA`], statusMap[`${projectAPI.id}-Done`]] : [statusMap[`${projectFE.id}-Development`], statusMap[`${projectFE.id}-Testing`], statusMap[`${projectFE.id}-Completed`]];

            await prisma.tasks.create({
                data: {
                    name: `${isBug ? '[BUG] ' : ''}${taskTemplate.name}`,
                    description: taskTemplate.description.replace('{{sprint.name}}', sprint.name),
                    sprint_id: sprint.id,
                    status_id: sprint.endDate < new Date() ? statusMap[`${sprint.project_id}-Done`]?.id || statusMap[`${sprint.project_id}-Completed`]?.id : statusPool[Math.floor(Math.random() * statusPool.length)].id,
                    priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
                    frontendBugCount: isBug && !isApi ? 1 : 0,
                    backendBugCount: isBug && isApi ? 1 : 0,
                }
            });
            totalTasks++;
        }
    }
    const allTasks = await prisma.tasks.findMany();
    console.log(`✅ A rich backlog of ${totalTasks} tasks has been created.`);

    // --- 6. TASK ASSIGNMENTS ---
    const projectUsersMap = (await prisma.project_User.findMany()).reduce((acc, pu) => {
        if (!acc[pu.project_id]) acc[pu.project_id] = [];
        acc[pu.project_id].push(pu);
        return acc;
    }, {});
    const taskUserPromises = allTasks.flatMap(task => {
        const sprint = allSprints.find(s => s.id === task.sprint_id);
        const relevantUsers = projectUsersMap[sprint.project_id]?.filter(pu => ['Developer', 'Team_Lead', 'Designer', 'Database'].includes(pu.role)) || [];
        if (relevantUsers.length > 0) {
            const numAssignees = Math.floor(Math.random() * 2) + 1; // 1-2 assignees
            const assignees = [...relevantUsers].sort(() => 0.5 - Math.random()).slice(0, numAssignees);
            return assignees.map(assignee => prisma.task_User.create({ data: { task_id: task.id, user_id: assignee.user_id } }));
        }
        return [];
    });
    await Promise.all(taskUserPromises);
    console.log("🙋 Tasks have been realistically assigned, with multiple collaborators.");

    // --- 7. COMMENTS ---
    const commentPromises = [];
    for (const task of allTasks) {
        const assignees = await prisma.task_User.findMany({ where: { task_id: task.id }, include: { user: true } });
        if (assignees.length === 0) continue;
        const assigneeNames = assignees.map(a => `@${a.user.username}`);
        const commentCount = Math.floor(Math.random() * 5) + 4; // 4-8 comments per task
        for (let i = 0; i < commentCount; i++) {
            const randomUser = userList[Math.floor(Math.random() * userList.length)];
            const userRole = projectUsers.find(pu => pu.user_id === randomUser.id)?.role;
            let commentPoolKey = 'dev';
            if (userRole === 'Project_Manager') commentPoolKey = 'pm';
            if (userRole === 'QA') commentPoolKey = 'qa';

            let message = realisticComments[commentPoolKey][Math.floor(Math.random() * realisticComments[commentPoolKey].length)];
            if (i === 1) message = `${assigneeNames.join(', ')}, what are your thoughts on the acceptance criteria? Seems straightforward.`;
            if (i === 0) message = 'Kicking this off. My initial thought is to approach this by...';

            commentPromises.push(prisma.task_Comment.create({
                data: {
                    task_id: task.id,
                    user_id: randomUser.id,
                    message: message,
                    type: 'comment',
                    createdAt: pastDate(Math.floor(Math.random() * 14)),
                }
            }));
        }
    }
    await Promise.all(commentPromises);
    console.log("💬 The team's communication history is now rich, detailed, and contextual.");

    // --- 8. SPRINT FEEDBACK ---
    const completedSprints = allSprints.filter(s => s.endDate < new Date());
    const feedbackPromises = [];
    for (const sprint of completedSprints) {
        const retroCount = Math.floor(Math.random() * 3) + 3; // 3-5 feedback items per retro
        for (let i = 0; i < retroCount; i++) {
            feedbackPromises.push(prisma.sprint_Feedback.create({
                data: {
                    sprint_id: sprint.id,
                    ...realisticRetrospectives[Math.floor(Math.random() * realisticRetrospectives.length)]
                }
            }));
        }
    }
    await Promise.all(feedbackPromises);
    console.log("📝 Actionable and unique retrospective feedback has been logged for all completed sprints.");


    console.log('\n✅✅✅ Hyper-realistic seed complete. The "AssignIT" database for ACME Innovations is now a living, breathing project history. Go give a killer demo.');
}

main()
    .catch(e => {
        console.error("Seeding protocol failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });