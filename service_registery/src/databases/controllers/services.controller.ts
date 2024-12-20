import fs from "node:fs";
import path from "node:path";
import semver from "semver";

const servicesPath = path.join(__dirname, "..", "jsons", "services.db.json");

const insert = (name: string, version: string, ip: string, port: string) => {
  let services: any = fs.readFileSync(servicesPath);
  services = JSON.parse(services);
  const key = `${name}-${version}-${ip}-${port}`;

  if (!services[key]) {
    services[key] = {};
    services[key].name = name;
    services[key].version = version;
    services[key].ip = ip;
    services[key].port = port;
    services[key].createdAt = Date.now();

    fs.writeFileSync(servicesPath, JSON.stringify({ ...services }));
  }

  return services[key];
};

const remove = (key: string) => {
  let services: any = fs.readFileSync(servicesPath);
  services = JSON.parse(services);

  const removedService = services[key];
  delete services[key];
  fs.writeFileSync(servicesPath, JSON.stringify({ ...services }));

  return removedService;
};

const get = (name: string, version: string) => {
  let services: any = fs.readFileSync(servicesPath);
  services = JSON.parse(services);

  const result = Object.values(services).filter(
    (service: any) =>
      service.name === name && semver.satisfies(service.version, version)
  );

  return result;
};

const getAll = () => {
  let services: any = fs.readFileSync(servicesPath);
  services = JSON.parse(services);

  return services;
};

export { insert, remove, get, getAll };
