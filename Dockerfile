FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/BaytyAI.API/BaytyAI.API.csproj", "src/BaytyAI.API/"]
COPY ["src/BaytyAI.Application/BaytyAI.Application.csproj", "src/BaytyAI.Application/"]
COPY ["src/BaytyAI.Domain/BaytyAI.Domain.csproj", "src/BaytyAI.Domain/"]
COPY ["src/BaytyAI.Infrastructure/BaytyAI.Infrastructure.csproj", "src/BaytyAI.Infrastructure/"]
COPY ["BaytyAI.slnx", "."]
RUN dotnet restore BaytyAI.slnx
COPY . .
RUN dotnet publish src/BaytyAI.API/BaytyAI.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BaytyAI.API.dll"]
