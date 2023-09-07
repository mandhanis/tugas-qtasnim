const LocalStrategy = require("passport-local");
const { pool } = require("./connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `select * from users where email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }

            if (isMatch) {
              const token = jwt.sign({ id: user.id }, "secret14114", {
                expiresIn: "1h", 
              });

              return done(null, { user, token }); 
            } else {
              return done(null, false, { message: "Password isn't correct" });
            }
          });
        } else {
          return done(null, false, { message: "Email isn't correct" });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query(`select * from users where id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
