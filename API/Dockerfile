# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# EXPOSE 80
# RUN apt-get update && apt-get install -y curl

# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src
# COPY ["API/API.csproj", "API/"]
# RUN dotnet restore "API/API.csproj"
# COPY . .
# WORKDIR "/src/API"
# RUN dotnet build "API.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "API.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENV ASPNETCORE_URLS=http://+:80
# ENV ASPNETCORE_ENVIRONMENT=Production
# ENTRYPOINT ["dotnet", "API.dll"]

# Use the official .NET image from the Docker Hub
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["API/API.csproj", "API/"]
RUN dotnet restore "API/API.csproj"
COPY . .
WORKDIR "/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
