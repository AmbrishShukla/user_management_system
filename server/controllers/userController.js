const pool = require("../db");

// list active users
exports.view = (req, res) => {
    pool.query('SELECT * FROM user WHERE status = ?', ['active'], (err, rows) => {
        if (err) return res.status(500).send('Database error');
        res.render('home', { rows, removedUser: req.query.removed });
    });
};

// search active users by first or last name
exports.find = (req, res) => {
    const searchTerm = '%' + (req.body.search || '') + '%';
    pool.query(
        'SELECT * FROM user WHERE status = ? AND (first_name LIKE ? OR last_name LIKE ?)',
        ['active', searchTerm, searchTerm],
        (err, rows) => {
            if (err) return res.status(500).send('Database error');
            res.render('home', { rows });
        }
    );
};

// show the add-user form
exports.form = (req, res) => {
    res.render('add-user');
};

// add a user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.query(
        'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',
        [first_name, last_name, email, phone, comments],
        (err) => {
            if (err) return res.status(500).send('Database error');
            res.render('add-user', { alert: 'User added successfully.' });
        }
    );
};

// show the edit form for one user
exports.edit = (req, res) => {
    pool.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).send('Database error');
        res.render('edit-user', { rows });
    });
};

// save the edit form
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    pool.query(
        'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
        [first_name, last_name, email, phone, comments, req.params.id],
        (err) => {
            if (err) return res.status(500).send('Database error');
            pool.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                if (err) return res.status(500).send('Database error');
                res.render('edit-user', { rows, alert: first_name + ' has been updated.' });
            });
        }
    );
};

// remove a user (kept in the table with status "removed")
exports.remove = (req, res) => {
    pool.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/?removed=' + encodeURIComponent('User removed'));
    });
};

// view one user
exports.viewOne = (req, res) => {
    pool.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).send('Database error');
        res.render('view-user', { rows });
    });
};
