const cron = require("node-cron");

const notificationService = require(
  "../services/notificationService"
);

const startOverdueTaskJob = () => {
  cron.schedule("5 0 * * *", async () => {
    try {
      console.log(
        "Checking for overdue tasks..."
      );

      await notificationService
        .checkOverdueTasks();

      console.log(
        "Overdue task check completed"
      );
    } catch (error) {
      console.error(
        "Overdue task check failed:",
        error.message
      );
    }
  });
};

module.exports = startOverdueTaskJob;