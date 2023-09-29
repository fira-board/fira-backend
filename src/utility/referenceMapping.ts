import Epic from "../models/epic";
import Task from "../models/task";

type ModelType = "project" | "resource" | "epic" | "task";

export const fetchWithReferences = async (inputModel: any, type: ModelType) => {
  const model = "toObject" in inputModel ? inputModel.toObject() : inputModel;

  switch (type) {
    case "resource":
      const [epics, tasks] = await Promise.all([
        Epic.find({ resource: model._id, deleted: false }).lean(),
        Task.find({ resource: model._id, deleted: false }).lean(),
      ]);

      const taskMapping = tasks.reduce((acc: { [id: string]: any }, task) => {
        acc[task._id.toString()] = task;
        return acc;
      }, {});

      const mappedEpics = epics.reduce<{ [title: string]: any }>(
        (acc, epic) => {
          acc[epic.title!] = {
            ...epic,
            tasks: epic.tasks
              .map((taskId: any) => taskMapping[taskId.toString()] || null)
              .filter(Boolean),
          };
          return acc;
        },
        {}
      );

      const { tasks: _, ...resourceWithoutTasks } = model;

      return {
        ...resourceWithoutTasks,
        epics: mappedEpics,
      };

    case "epic":
      const epicTasks = await Task.find({
        epic: model._id,
        deleted: false,
      }).lean();
      return {
        ...model,
        tasks: epicTasks,
      };

    case "project":
      const [associatedResources, associatedEpics, associatedTasks] =
        await Promise.all([
          Resource.find({ project: model._id }).lean(),
          Epic.find({ project: model._id, deleted: false }).lean(),
          Task.find({ project: model._id, deleted: false }).lean(),
        ]);

      const taskMappingForProject = associatedTasks.reduce(
        (acc: { [id: string]: any }, task) => {
          acc[task._id.toString()] = task;
          return acc;
        },
        {}
      );

      const mappedEpicsForProject = associatedEpics.reduce<{
        [title: string]: any;
      }>((acc, epic) => {
        acc[epic.title!] = {
          ...epic,
          tasks: epic.tasks
            .map(
              (taskId: any) => taskMappingForProject[taskId.toString()] || null
            )
            .filter(Boolean),
        };
        return acc;
      }, {});

      return {
        ...model,
        resources: associatedResources,
        epics: mappedEpicsForProject,
        tasks: associatedTasks,
      };

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

export default fetchWithReferences;
