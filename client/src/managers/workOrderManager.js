const _apiUrl = "/api/workorder";


//Get workorders outstanding
export const getIncompleteWorkOrders = () => {
    return fetch(_apiUrl + "/incomplete").then((res) => res.json());
};

//Post workorder form data
export const createWorkOrder = (workOrder) => {
    return fetch(_apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrder),
    }).then((res) => res.json);
};

// Update  the work order
export const updateWorkOrder = (workOrder) => {
    return fetch(`${_apiUrl}/${workOrder.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrder),
    });
};

export const updateAsComplete = (workOrder) => {
    return fetch(`${_apiUrl}/${workOrder.id}/complete`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workOrder),
    });
};
export const deleteAWorkOrder = (workOrderId) => {
    return fetch(`${_apiUrl}/${workOrderId}/delete`, {
        method: "Delete",
        // headers: {
        //     "Content-Type": "application/json",
        // },

    });
};