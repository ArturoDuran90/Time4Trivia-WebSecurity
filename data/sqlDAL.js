// sqlDAL is responsible to for all interactions with mysql for Membership
const User = require('../models/user').User;
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

const mysql = require('mysql2/promise');
const sqlConfig = {
    host: '10.0.30.152',
    user: 'student_t5',
    password: 'br[QloOj<Ia_E?g!x-4alsW!E',
    database: 'Time4Trivia',
    multipleStatements: true
};

/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users;`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            //console.log(sql);
            const [roleResults, ] = await con.query('select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?', [u.userId]);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.FirstName, u.LastName, u.Password, roles));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
 exports.getUsersByRole = async function (role) {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = '${role}'`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            //console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.FirstName, u.LastName, u.Password, roles));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where UserId = ${userId}`;
        
        const [userResults, ] = await con.query('select * from Users where UserId = ?', [userId]);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            //console.log(sql);
            const [roleResults, ] = await con.query('select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?', [u.userId]);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.FirstName, u.LastName, u.Password, roles);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

exports.deleteUserById = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query('delete from UserRoles where UserId = ?' [userId]);
        // console.log(result);

        sql = `delete from Users where UserId = ${userId}`;
        result = await con.query('delete from Users where UserId = ?', [userId]);
        // console.log(result);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} delted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */
exports.getUserByUsername = async function (username) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where Username = '${username}'`;
        //console.log(sql);
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            //console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.FirstName, u.LastName, u.Password, roles);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
    results = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ${userId}`;

        const [results, ] = await con.query(sql);

        for(key in results){
            let role = results[key];
            results.push(role.Role);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return results;
}

/**
 * @param {*} username 
 * @param {*} hashedPassword 
 * @param {*} email 
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email, firstName, lastName) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `insert into Users (Username, Email, Password, FirstName, LastName) values ('${username}', '${email}', '${hashedPassword}', '${firstName}', '${lastName}')`;
        const userResult = await con.query('insert into Users (Username, Email, Password, FirstName, LastName) values (?, ?, ?, ?, ?)', [username, email, hashedPassword, firstName, lastName]);

        let newUserId = userResult[0].insertId;

        sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1)`;
        await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account Created with User Id: ' + newUserId;
        result.data = newUserId;
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
}

/**
 * 
 * @param {*} userId 
 * @param {*} hashedPassword 
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set password = '${hashedPassword}' where userId = '${userId}'`;
        const userResult = await con.query('update Users set password = ? where userId = ?', [hashedPassword, userId]) ;

        // console.log(r);
        result.status = STATUS_CODES.success;
        result.message = 'Profile updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }
}

/**
 * 
 * @param {*} userId 
 * @param {*} firstName 
 * @param {*} lastName
 * @returns a result object with status/message
 */
exports.updateProfile = async function (userId, firstName, lastName) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set firstName = '${firstName}', lastName = '${lastName}' where userId = '${userId}'`;
        const userResult = await con.query('update Users set firstName = ?, lastName = ? where userId = ?', [firstName, lastName, userId]);

        // console.log(r);
        result.status = STATUS_CODES.success;
        result.message = 'Profile updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }
}

/**
 * @returns and array of questions
 */
exports.getQuestions = async function () {
    let result = {};

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `SELECT * FROM triviaquestions WHERE isVerified=true;`;

        result = await con.query(sql);

        result = result[0];

        //console.log("DAL Questions:", result);
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return result;
}

/**
 * Create a score in the database.
 * @param {number} userId - The ID of the user.
 * @param {number} score - The score to be saved.
 * @returns {Promise<object>} - A Promise resolving to the result of the database operation.
 */
exports.createScore = async function (userId, score) {
    let result = new Result();
    const con = await mysql.createConnection(sqlConfig); // Create a connection using your SQL configuration

    try {
        const sql = `INSERT INTO leaderboard(UserId, Score) VALUES (${userId}, ${score})`;

        await con.query('INSERT INTO leaderboard(UserId, Score) VALUES (?, ?)', [userId, score]);

        result.status = STATUS_CODES.success;
        result.message = 'Score added to db.';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
};

/**
 * @returns and array of scores
 */
exports.getScores = async function () {
    let result = {};

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `SELECT u.Username, t.score
                    FROM leaderboard AS t
                    JOIN users AS u ON t.userId = u.userId
                    ORDER BY t.score DESC
                    LIMIT 10;`;

        result = await con.query(sql);

        result = result[0];

        //console.log("DAL Questions:", result);
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return result;
}

/**
 * Create a score in the database.
 * @param {text} question - The Question.
 * @param {text} correctAnswer - The Correct answer to the question.
 * @param {text} incorrectAnwer1 - The Incorrect Answer1 to the question.
 * @param {text} incorrectAnwer2 - The Incorrect Answer2 to the question.
 * @param {text} incorrectAnwer3 - The Incorrect Answer3 to the question.
 * @returns {Promise<object>} - A Promise resolving to the result of the database operation.
 */
exports.createQuestion = async function (question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    let result = new Result();
    const con = await mysql.createConnection(sqlConfig); // Create a connection using your SQL configuration

    try {
        const sql = `INSERT INTO triviaquestions(question, correct_Answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, isVerified) VALUES ('${question}', '${correctAnswer}', '${incorrectAnswer1}', '${incorrectAnswer2}', '${incorrectAnswer3}', false)`;

        await con.query('INSERT INTO triviaquestions(question, correct_Answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3, isVerified) VALUES (?, ?, ?, ?, ?, false)', [question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]);

        result.status = STATUS_CODES.success;
        result.message = 'Question added to db.';
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
};

/**
 * @returns and array of scores
 */
exports.getQuestionsToVerify = async function () {
    let result = {};

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `SELECT * FROM triviaquestions WHERE isVerified=false;`;

        result = await con.query(sql);

        result = result[0];
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }
    return result;
}

/**
 * Create a score in the database.
 * @param {text} question - The Question.
 * @param {text} correctAnswer - The Correct answer to the question.
 * @param {text} incorrectAnwer1 - The Incorrect Answer1 to the question.
 * @param {text} incorrectAnwer2 - The Incorrect Answer2 to the question.
 * @param {text} incorrectAnwer3 - The Incorrect Answer3 to the question.
 * @returns {Promise<object>} - A Promise resolving to the result of the database operation.
 */
exports.submitQuestionsToVerify = async function (questionId) {
    let result = new Result();
    const con = await mysql.createConnection(sqlConfig); // Create a connection using your SQL configuration

    try {
        const sql = `UPDATE triviaquestions SET isVerified = true WHERE triviaquestions.id = ${questionId};`;

        await con.query('UPDATE triviaquestions SET isVerified = true WHERE triviaquestions.id = ?;', [questionId]);

        result.status = STATUS_CODES.success;
        result.message = 'Question verified to db.';
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
};