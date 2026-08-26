import { describe, expect, it } from "vitest";
import { filterAndSortRequests } from "../lib/request-queue";
import type { Request } from "../lib/maintenance-store";

const item = (id: string, status: Request["status"], priority: Request["priority"], team: Request["team"]): Request => ({ id, title: id, category: "ICT", location: "Lab", description: "Test", priority, status, reporter: "Tester", team, time: "Now", activity: [] });
const requests = [item("CM-12", "Assigned", "High", "ICT"), item("CM-14", "Submitted", "Urgent", "Security"), item("CM-13", "In Progress", "Medium", "Physical Maintenance")];

describe("administrator maintenance queue", () => {
  it("filters urgent security work", () => {
    expect(filterAndSortRequests(requests, { status: "All", priority: "Urgent", team: "Security", sort: "Newest" }).map((item) => item.id)).toEqual(["CM-14"]);
  });
  it("puts pending requests first when requested", () => {
    expect(filterAndSortRequests(requests, { status: "All", priority: "All", team: "All", sort: "Pending" }).map((item) => item.id)).toEqual(["CM-14", "CM-12", "CM-13"]);
  });
  it("sorts by criticality when requested", () => {
    expect(filterAndSortRequests(requests, { status: "All", priority: "All", team: "All", sort: "Priority" }).map((item) => item.id)).toEqual(["CM-14", "CM-12", "CM-13"]);
  });
});
