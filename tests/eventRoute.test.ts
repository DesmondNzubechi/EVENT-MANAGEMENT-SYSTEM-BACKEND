import app from "../App";
import request from "supertest";
import { Events } from "../models/eventModel";
import {test} from '@jest/globals'

describe("EVENT ROUTE", () => {
  describe("POST /api/v1/event/createEvent", () => {
    test("should create an event and return a new event with 201 status", async () => {
      const newEvent = {
        title: "Tech Conference",
        description: "A great tech conference",
        date: "2024-11-01",
        location: "New York",
        price: 100,
        totalTicket: 200,
        availableTicket: 200,
        image: "event-image-url",
      };

      const response = await request(app)
        .post("/api/v1/event/createEvent")
        .send(newEvent);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toMatchObject({
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location,
        price: newEvent.price,
        totalTicket: newEvent.totalTicket,
        availableTicket: newEvent.availableTicket,
        image: "event-image-url",
      });
    }, 20000);
  });
});

describe("EVENT ROUTE", () => {
  test("should get data that matches the event", async () => {
    const sampleEventData = new Events({
      title: "Tech Conference",
      description: "A great tech conference",
      date: "2024-11-01",
      location: "New York",
      price: 100,
      totalTicket: 200,
      availableTicket: 200,
      bookedTicket: 0,
      image: "event-image-url",
      status: "unpublished",
    });

    await sampleEventData.save();

    const response = await request(app).get("/api/v1/event/getAllEvent");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Tech Conference",
          description: "A great tech conference",
          date: "2024-11-01",
          location: "New York",
          price: 100,
          totalTicket: 200,
          availableTicket: 200,
          bookedTicket: 0,
          image: "event-image-url",
          status: "unpublished",
        }),
      ])
    );
  });
});
