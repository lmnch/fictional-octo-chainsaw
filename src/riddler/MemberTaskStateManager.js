import sqlite3 from "sqlite3";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

class MemberTaskStateManager {
  initSQLite(path) {
    if (!path) path = ":memory:";
    this._db = new sqlite3.Database(path);
  }

  createTableIfNotExists() {
    this._db.run(
      "CREATE TABLE IF NOT EXISTS MemberTaskData (userid TEXT, mystery TEXT, taskname TEXT, statejson TEXT, PRIMARY KEY(userid, mystery, taskname));"
    );
  }

  getMemberTaskState(taskname, member) {
    const memberid = member.id;
    const myst = roomManager.loadedMystery;

    return new Promise((resolve, reject) => {
      this._db.get(
        "SELECT statejson FROM MemberTaskData WHERE userid=? AND mystery=? AND taskname=?",
        [memberid, myst, taskname],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            if (row && row.statejson) {
              resolve(JSON.parse(row.statejson));
            } else {
              resolve();
            }
          }
        }
      );
    });
  }

  setMemberTaskState(taskname, member, stateobj) {
    const userid = member.id;
    const myst = roomManager.loadedMystery;

    const statejson = JSON.stringify(stateobj);

    return new Promise((res, rej) => {

      this.getMemberTaskState(taskname, member).then(existing=>{
        if(existing){
          this._db.run(
            `UPDATE MemberTaskData SET statejson=? WHERE userid=? AND mystery=? AND taskname=?`,
            [statejson, userid, myst, taskname],
            (err) => {
              if (err) {
                rej(err);
              } else {
                res();
              }
            }
          );
        }else{
          this._db.run(
            `INSERT INTO MemberTaskData ( userid, mystery, taskname, statejson) VALUES(?,?,?,?)`,
            [userid, myst, taskname, statejson],
            (err) => {
              if (err) {
                rej(err);
              } else {
                res();
              }
            }
          );
        }

      })      
    });
  }

  removeMemberTaskStateEntry(taskname, member){
    const userid = member.id;
    const myst = roomManager.loadedMystery;

    return new Promise((resolve, reject)=>{
      this._db.run("DELETE FROM MemberTaskData WHERE userid=? AND mystery=? AND taskname=?",
      [userid, myst, taskname], (err)=>{
        if(err){
          reject(err);
        }else{
          resolve();
        }
      })
    })
  }

  close() {
    this._db.close();
  }
}

const memberTaskStateManager = new MemberTaskStateManager();
export default memberTaskStateManager;
