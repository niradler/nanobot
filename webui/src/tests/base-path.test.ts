import { afterEach, describe, expect, it, vi } from "vitest";

import { getBasePath } from "@/lib/base-path";
import { deriveWsUrl } from "@/lib/bootstrap";

function stubLocation(loc: Partial<Location>): void {
  vi.stubGlobal("window", { location: loc });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getBasePath", () => {
  it("returns '' for the web root (direct/native access)", () => {
    stubLocation({ pathname: "/" });
    expect(getBasePath()).toBe("");
  });

  it("extracts the HA Ingress prefix (trailing slash)", () => {
    stubLocation({ pathname: "/api/hassio_ingress/AbC-123/" });
    expect(getBasePath()).toBe("/api/hassio_ingress/AbC-123");
  });

  it("extracts the prefix even with a deeper sub-path", () => {
    stubLocation({ pathname: "/api/hassio_ingress/AbC-123/settings" });
    expect(getBasePath()).toBe("/api/hassio_ingress/AbC-123");
  });
});

describe("deriveWsUrl under Ingress", () => {
  it("prefixes the WebSocket URL with the Ingress base path (wss)", () => {
    stubLocation({
      protocol: "https:",
      host: "homeassistant.example.com",
      port: "",
      pathname: "/api/hassio_ingress/AbC-123/",
    } as Partial<Location>);
    expect(deriveWsUrl("/", "tok")).toBe(
      "wss://homeassistant.example.com/api/hassio_ingress/AbC-123/?token=tok",
    );
  });
});
