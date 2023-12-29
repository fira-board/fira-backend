import Status from './models/status'; // Import your model
import { SYSTEM_TO_DO } from './models/status';
import { SYSTEM_IN_PROGRESS } from './models/status';
import { SYSTEM_DONE } from './models/status';


const initialData = [
    {
        _id: SYSTEM_TO_DO,
        title: "To Do",
        userId: "system",
        color: "#FF0000",
        order: 10,
    },
    {
        _id: SYSTEM_IN_PROGRESS,
        title: "In Progress",
        userId: "system",
        color: "#FFA500",
        order: 20,
    },
    {
        _id: SYSTEM_DONE,
        title: "Done",
        userId: "system",
        color: "#008000",
        order: 30,
    },
];

export default async function initializeData() {
    try {
        await Status.insertMany(initialData);
        console.log('Data initialized successfully');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}