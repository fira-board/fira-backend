import Resource from "../models/resource";
import Epic from "../models/epic";
import Task from "../models/task";

type ModelType = "project" | "resource" | "epic" | "task";

export const fetchWithReferences = async (models: any | any[], type: ModelType) => {
    // Convert to plain objects if they're Mongoose documents.
    if (models.toObject) {
      models = models.toObject();
    } else if (Array.isArray(models) && models[0]?.toObject) {
      models = models.map(model => model.toObject());
    }

    const isMultiple = Array.isArray(models);
    const output: any[] = [];
    
    const ids = isMultiple ? models.map((model: any) => model._id.toString()) : [models._id.toString()];

    switch (type) {
        case 'resource':
            const epics = await Epic.find({ resource: { $in: ids }, deleted: false }).lean();
            const tasks = await Task.find({ resource: { $in: ids }, deleted: false }).lean();

            const handleResource = (model: any) => {
                const relevantEpics = epics.filter(epic => epic.resource?.toString() === model._id.toString());

                const structuredModel = {
                    ...model,
                    epics: relevantEpics.reduce((acc: { [title: string]: any }, epic) => {
                        acc[epic.title!] = {
                            ...epic,
                            tasks: epic.tasks.map((taskId: any) => tasks.find(task => task._id.toString() === taskId.toString()) || null).filter(Boolean)
                        };
                        return acc;
                    }, {})
                };

                // Remove the top-level tasks array
                delete structuredModel.tasks;

                output.push(structuredModel);
            }

            if (isMultiple) {
                models.forEach(handleResource);
            } else {
                handleResource(models);
                return output[0];
            }
            break;

        case 'epic':
            const epicTasks = await Task.find({ epic: { $in: ids }, deleted: false }).lean();

            const handleEpic = (model: any) => {
                const relevantTasks = epicTasks.filter(task => task.epic?.toString() === model._id.toString());
                const structuredModel = {
                    ...model,
                    tasks: relevantTasks
                };

                output.push(structuredModel);
            }

            if (isMultiple) {
                models.forEach(handleEpic);
            } else {
                handleEpic(models);
                return output[0];
            }
            break;

            case 'project':
    const projectResources = await Resource.find({ project: { $in: ids } }).lean();
    const projectEpics = await Epic.find({ project: { $in: ids } }).lean();
    const projectTasks = await Task.find({ project: { $in: ids } }).lean();

    const handleProject = (model: any) => {
        const relevantResources = projectResources.filter(resource => resource.project?.toString() === model._id.toString());

        // For each resource, attach relevant epics and their tasks
        relevantResources.forEach(resource => {
            const relatedEpics = projectEpics.filter(epic => epic.resource?.toString() === resource._id.toString());

            relatedEpics.forEach(epic => {
                epic.tasks = projectTasks.filter(task => task.epic?.toString() === epic._id.toString());
            });

            resource.epics = relatedEpics;
            delete (resource as any).tasks;
        });

        const structuredModel = {
            ...model,
            resources: relevantResources
        };

        delete structuredModel.tasks;
        delete structuredModel.epics;

        output.push(structuredModel);
    }

    if (isMultiple) {
        models.forEach(handleProject);
    } else {
        handleProject(models);
        return output[0];
    }
    break;

        default:
            throw new Error(`Unsupported type: ${type}`);
    }

    return output;
};

export default fetchWithReferences;
