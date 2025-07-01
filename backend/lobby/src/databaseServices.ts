import sqlite3 from "sqlite3";
import { db } from "./initDatabase";

export function findAllDbAsync(sql: string, parameters: any[]): Promise<any>
{
    return new Promise((resolve, reject) => {
        db.all(sql,parameters, (err,rows) => {
            if (err)
                reject(err)
            else
                resolve(rows)
        })
    })
}

export function getDbAsync(sql: string ,parameters: any[]): Promise<any>
{
    return new Promise((resolve, reject) => {
        db.get(sql,parameters,(err, row) => {
            if (err)
                reject(err)
            else
                resolve(row)
        })
    })
}

export function runDbAsync(sql: string, parameters: any[]) : Promise<number>
{
    return new Promise((resolve, reject) => {
        db.run(sql, parameters, function (this: sqlite3.RunResult, err)
        {
            if (err)
                reject(err)
            else
                resolve(this.lastID)
        })
    })
}
