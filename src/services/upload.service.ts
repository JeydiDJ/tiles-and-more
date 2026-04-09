export async function uploadAsset(fileName: string) {
  return {
    fileName,
    url: `/uploads/${fileName}`,
    status: "placeholder",
  };
}
