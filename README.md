# Karpuz Backend

## Endpoints

---

### Auth

- POST
  - /v1/auth/login | Login
  - /v1/auth/register | Register
    ```json
    //Example body
    {
    	"username": "testuser",
    	"password": "test123"
    }
    ```

### Content

- POST

  - /v1/content/create | Create content
    ```json
    //Example body
    {
    	"username": "testuser"
    	"post": "test post",
    }
    ```
  - /v1/content/comment/create | Create comment
    ```json
    //Example body
    {
    	"username": "testuser"
    	"contentId": "629373bdd155cf2e3ce18653",
    	"comment": "test comment",
    }
    ```

- PUT

  - /v1/content/like | Like content
    ```json
    //Example body
    {
    	"username": "testuser"
    	"contentId": "629373bdd155cf2e3ce18653",
    }
    ```

- GET
  - /v1/content/paginated?page=1&limit=5
