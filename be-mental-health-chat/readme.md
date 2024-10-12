Overall architecture of the application
```mermaid
graph TD
    A[Client Browser] -->|HTTP/HTTPS| B[Angular Frontend]
    B -->|API Calls| C[ASP.NET Core Web API]
    C --> D[Application Layer]
    C --> E[Domain Layer]
    C --> F[Infrastructure Layer]
    F -->|Data Access| G[(PostgreSQL Database)]
    F -->|AI Integration| H[Gemini API]
    
    
    subgraph "Frontend"
    B
    end
    
    subgraph "Backend"
    C
    D
    E
    F
    end
    
    subgraph "External Services"
    G
    H
    end
```

Add migration
```bash
dotnet ef migrations add <name> --verbose -s .\API\ -p .\Infrastructure\
````

Apply migration
```bash
dotnet ef database update --verbose -s .\API\ -p .\Infrastructure\
```