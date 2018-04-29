<br><br><br><br>
<div class ="col-lg-10 col-lg-offset-1">
    <table id="table" class="table table-striped table-bordered responsive nowrap" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Enabled</th>
                <th>Bpulse Token</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {% for user in users %}
                <tr>
                    <td>{{ user.first_name|e }}</td>
                    <td>{{ user.last_name|e }}</td>
                    <td>{{ user.email|e }}</td>
                    <td>{{ user.enabled|e }}</td>
                    <td>{{ user.bpulse_user_token|e }}</td>
                    <td><a href="/user/delete/{{ user.id }}">Delete</a></td>
                </tr>
            {% endfor  %}
        </tbody>
    </table>
</div>