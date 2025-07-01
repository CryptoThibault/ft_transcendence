import { findAllDbAsync, getDbAsync, runDbAsync } from "./databaseServices";

export async function getLobbies(lobby_id: number): Promise<any> 
{
    try {
    const lobby = await findAllDbAsync(`SELECT * FROM lobbies WHERE (id = ?)`, [lobby_id]);

    if (!lobby) {
      throw { statusCode: 404, message: "Lobby is not found" };
    }

    const usersInLobby = await findAllDbAsync(`SELECT * FROM user_lobbies WHERE (lobby_id = ?)`, [lobby_id])

    return { lobby, users: usersInLobby };
  } catch (error) {
    throw { statusCode: 500, message: "Database error retrieving lobby or users", details: error };
  }
}

function getUsersLobbies(user_id: number): Promise<any>
{
  return new Promise(async (resolve,reject) => {
    try {
      const row = await getDbAsync(`SELECT * FROM user_lobbies WHERE (user_id = ?)`, [user_id])
      resolve(row)
    } catch (error) {
      reject(error)
    }
  })
}


export async function createLobby(name: string, capacity: number, creator_id: number){
  const userlobby = await getUsersLobbies(creator_id)
  if (userlobby)
  {
    throw { statusCode: 500, message: "Database error creating lobby or user_lobby, user is already in another lobby"};
  }
  try {
    const lobbyID = await runDbAsync('INSERT INTO lobbies (name, capacity, creator_id) VALUES (?,?,?)', [name,capacity,creator_id])
    await runDbAsync(`INSERT INTO user_lobbies (user_id, lobby_id) VALUES (?,?)`, [creator_id, lobbyID])
  } catch (error) {
    throw { statusCode: 500, message: "Database error creating lobby or user_lobby", details: error };
  }
}

export async function joinLobby(user_id: number, lobby_id: number): Promise<void>
{
  const userlobby = await getUsersLobbies(user_id)
  if (userlobby)
  {
    throw { statusCode: 500, message: "Database error creating lobby or user_lobby, user is already in another lobby"};
  }
  try {
    await runDbAsync(`INSERT INTO user_lobbies (user_id,lobby_id) VALUES (?,?)`, [user_id, lobby_id])
  } catch (error: any) {
    if (error.statusCode && error.message) {
      throw error;
    }
    throw { statusCode: 500, message: "Database error while joining lobby", details: error };
  }
}


