const express = require("express");
const bodyParser = require("body-parser");
const Docker = require("dockerode");

const app = express();

app.use(bodyParser.json());

const port = 3000;

const docker = new Docker();

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/container-list", async (req, res) => {
  try {
    const containers = await docker.listContainers();
    const containerDetails = containers.map((container) => ({
      id: container.Id,
      name: container.Names[0],
      image: container.Image,
      state: container.State,
    }));

    res.status(200).json({ success: true, containers: containerDetails });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error getting container list: ${error.message}`,
    });
  }
});

app.post('/specific-container-restart/:containerName', async (req, res) => {
  try {
    const containerName = req.params.containerName;

    const container = docker.getContainer(containerName);

    try {
      const containerInfo = await container.inspect();
      const isRunning = containerInfo.State.Running;

      if (isRunning) {
        await container.stop();
        await container.start();
        res.status(200).json({
          success: true,
          message: `Container ${containerName} stopped and started successfully.`,
        });
      } else {
        await container.start();
        res.status(200).json({
          success: true,
          message: `Container ${containerName} started successfully.`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Error stopping or starting container ${containerName}: ${error.message}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error restarting specific container: ${error.message}`,
    });
  }
});

app.post("/selected-containers-restart", async (req, res) => {
  try {
    const containerNames = req.body.containerNames;

    if (!containerNames || !Array.isArray(containerNames)) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid request format. Please provide an array of container names in the request body.",
      });
    }

    const restartPromises = containerNames.map(async (containerName) => {
      const container = docker.getContainer(containerName);

      try {
        const containerInfo = await container.inspect();
        const isRunning = containerInfo.State.Running;

        if (isRunning) {
          await container.stop();
          await container.start();
          return `Container ${containerName} stopped and started successfully.`;
        } else {
          await container.start();
          return `Container ${containerName} started successfully.`;
        }
      } catch (error) {
        return `Error stopping or starting container ${containerName}: ${error.message}`;
      }
    });

    const restartMessages = await Promise.all(restartPromises);

    res.status(200).json({
      success: true,
      messages: restartMessages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error restarting selected containers: ${error.message}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
