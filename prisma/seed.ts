import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const memberPassword = await bcrypt.hash("member123", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: adminPassword,
      role: "admin",
      active: true
    }
  });

  const member = await prisma.user.upsert({
    where: { username: "member" },
    update: {},
    create: {
      username: "member",
      passwordHash: memberPassword,
      role: "member",
      active: true
    }
  });

  const calendarEntry = await prisma.calendarEntry.create({
    data: {
      title: "Buehnenprobe",
      start: new Date(Date.now() + 1000 * 60 * 60 * 24),
      end: new Date(Date.now() + 1000 * 60 * 60 * 26),
      location: "Studio 1",
      notes: "Aufbau ab 16:00",
      category: "probe",
      assignedUsers: { connect: [{ id: admin.id }, { id: member.id }] }
    }
  });

  const event = await prisma.event.create({
    data: {
      name: "Interne Show",
      start: new Date(Date.now() + 1000 * 60 * 60 * 48),
      end: new Date(Date.now() + 1000 * 60 * 60 * 52),
      venue: "Halle West",
      contact: "Alex Technik",
      status: "geplant",
      notes: "Technikcheck am Vortag",
      checklist: {
        create: [
          { area: "Ton", text: "Mikrofone checken" },
          { area: "Licht", text: "Scheinwerfer testen" }
        ]
      },
      equipment: {
        create: [
          {
            itemName: "Lautsprecher",
            quantity: 4,
            condition: "ok",
            storageLocation: "Lager A",
            reserved: true
          }
        ]
      }
    }
  });

  await prisma.bookingRequest.create({
    data: {
      requesterName: "Mara Muster",
      email: "mara@example.com",
      phone: "",
      eventTitle: "Sommerfest",
      start: new Date(Date.now() + 1000 * 60 * 60 * 72),
      end: new Date(Date.now() + 1000 * 60 * 60 * 78),
      location: "Open Air",
      audienceSize: 250,
      techNeedsCategories: JSON.stringify(["Ton", "Licht"]),
      techNeedsText: "DJ Set + Moderation",
      budget: 2500,
      notes: "Parkplaetze vorhanden",
      status: "neu",
      assignedToUserId: admin.id
    }
  });

  await prisma.timeEntry.create({
    data: {
      userId: member.id,
      start: new Date(Date.now() - 1000 * 60 * 120),
      end: new Date(Date.now() - 1000 * 60 * 60),
      duration: 60
    }
  });

  await prisma.calendarEntry.update({
    where: { id: calendarEntry.id },
    data: { assignedUsers: { connect: [{ id: member.id }] } }
  });

  await prisma.requestComment.create({
    data: {
      requestId: (await prisma.bookingRequest.findFirstOrThrow()).id,
      userId: admin.id,
      text: "Bitte Kontakt bestaetigen."
    }
  });

  console.log("Seed data created", { admin: admin.username, member: member.username, event: event.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
