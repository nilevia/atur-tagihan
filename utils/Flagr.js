import axios from 'axios';
/**
 * @summary this method is used to call flagr api with simple call
 * will return whether it enable or disable based on id given
 * @param id
 */

export async function featureEnable(id) {
  let enabled = false;
  // const BASE_URL = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_FLAGR_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_API_FLAGR_URL;
  const url = `${BASE_URL}flags/${id}`;

  await axios
    .get(url)
    .then((apiResponse) => {
      enabled = apiResponse.data.enabled;
    })
    .catch(() => {
      enabled = false;
    });

  return enabled;
}
