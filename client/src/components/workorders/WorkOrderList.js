

import { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { deleteAWorkOrder, getIncompleteWorkOrders, updateAsComplete } from "../../managers/workOrderManager.js";
import { Link } from "react-router-dom";
import { getUserProfiles } from "../../managers/userProfileManager.js";
import { Input } from "reactstrap";
import { updateWorkOrder } from "../../managers/workOrderManager.js";



export default function WorkOrderList({ loggedInUser }) {
    const [workOrders, setWorkOrders] = useState([]);

    const [mechanics, setMechanics] = useState([]);

    const assignMechanic = (workOrder, mechanicId) => {
        const clone = structuredClone(workOrder);
        clone.userProfileId = mechanicId || null;
        updateWorkOrder(clone).then(() => {
            getIncompleteWorkOrders().then(setWorkOrders);
        });
    };

    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
        getUserProfiles().then(setMechanics);
    }, []);


    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
    }, []);

    const completeWorkOrder = (workOrderId) => {
        const updatedWorkOrders = workOrders.map((wo) => {
            if (wo.id === workOrderId) {
                return { ...wo, DateCompleted: new Date() }; // Set DateCompleted to the current date
            }
            return wo;
        });

        updateAsComplete({ id: workOrderId, DateCompleted: new Date() }).then(() => {
            setWorkOrders(updatedWorkOrders);
        });
        window.location.reload();
    };


    const deleteWorkOrder = (workOrderId) => {
        const workOrder = { id: workOrderId };
        deleteAWorkOrder(workOrderId).then(() => {
            window.location.reload();
        });

    };

    return (
        <>
            <h2>Open Work Orders</h2>
            <Link to="/workorders/create">New Work Order</Link>

            <Table>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Description</th>
                        <th>DateSubmitted</th>
                        <th>Mechanic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workOrders.map((wo) => (
                        <tr key={wo.id}>
                            <th scope="row">{wo.bike.owner.name}</th>
                            <td>{wo.bike.brand}</td>
                            <td>{wo.bike.color}</td>
                            <td>{wo.description}</td>
                            <td>{new Date(wo.dateInitiated).toLocaleDateString()}</td>
                            <td>
                                {wo.userProfile
                                    ? `${wo.userProfile.firstName} ${wo.userProfile.lastName}`
                                    : "unassigned"}
                            </td>
                            <td>
                                <Input
                                    type="select"
                                    onChange={(e) => {
                                        assignMechanic(wo, parseInt(e.target.value));
                                    }}
                                    value={wo.userProfileId || 0}
                                >
                                    <option value="0">Choose mechanic</option>
                                    {mechanics.map((m) => (
                                        <option
                                            key={m.id}
                                            value={m.id}
                                        >{`${m.firstName} ${m.lastName}`}</option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                {wo.userProfile && (
                                    <Button
                                        onClick={() => completeWorkOrder(wo.id)}
                                        color="success"
                                    >
                                        Mark as Complete
                                    </Button>
                                )}
                            </td>
                            <td>
                                {wo.userProfile && (
                                    <Button
                                        onClick={() => deleteWorkOrder(wo.id)}
                                        color="danger"
                                    >
                                        Delete
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}