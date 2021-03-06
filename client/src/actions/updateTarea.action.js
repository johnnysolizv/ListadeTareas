const updateTarea = async (data) => {
    console.log(data)
    try{
        const res = await fetch("/api/updatetarea", {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json',
        },
    });
    const json = await res.json();
    if (!res.ok) {
        const errors = Object.entries(json.errors).map(
            ([field, { message }]) => ({ field, message }),
        );
        return { success: false, data: errors };
    }
    return { success : true, data : json};
    } catch (e) {
        console.error(e);
        return { success: false, data: { errors: { error: e } } };
    }
};


export default updateTarea;