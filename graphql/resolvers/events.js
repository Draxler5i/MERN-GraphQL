module.exports = {
    createEvent: async ({ eventInput }, req) => {
        // Validate first
        checkAuth(req.isAuth);
        const event = new Event ({
            title: eventInput.title,
            topic: eventInput.topic,
            description: eventInput.description,
            price: eventInput.price,
            date: new Date(eventInput.date),
            creator: req.userId
        });
        const saveEvent = await event.save();
        const user = await user.findById(req.userId);
        user.createdEvents.push(saveEvent);
        await user.save();
        return { ...saveEvent,_doc, _id: saveEvent._id.toString() };
    },
    updateEvent: async ({ eventId, eventInput }, req) => {
        checkAuth(req.isAuth);
        const event = await fetchOrThrowEvent(eventId);
        event.title = eventInput.title;
        event.topic = eventInput.topic;
        event.description = eventInput.description;
        event.price = eventInput.price;
        event.date = new Date(eventInput.date);
        return generateUpdateEvent(updateEvent);
    },
    events: async ({ booked, byUser }, req) => {
        
    }
}