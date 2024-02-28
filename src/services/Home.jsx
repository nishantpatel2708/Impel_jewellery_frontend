import call from "./Call";

const banners = async () => {
  let d = await call({
    path: "banners",
    method: "GET",
  });
  return d;
};

const category = async () => {
  let d = await call({
    path: "parent-category",
    method: "GET",
  });
  return d;
};

const TopSelling = async () => {
  let d = await call({
    path: "highest-selling-designs",
    method: "GET",
  });
  return d;
};

const RecentAdd = async () => {
  let d = await call({
    path: "latest-designs",
    method: "GET",
  });
  return d;
};

const Featured = async () => {
  let d = await call({
    path: "flash-design",
    method: "GET",
  });
  return d;
};

const SiteSetting = async () => {
  let d = await call({
    path: "site-settings",
    method: "GET",
  });
  return d;
};

const CustomPages = async (data) => {
  let d = await call({
    path: "custom-pages",
    method: "POST",
    data,
  });
  return d;
};
const exportObject = {
  banners,
  category,
  TopSelling,
  RecentAdd,
  CustomPages,
  Featured,
  SiteSetting,
};

export default exportObject;
