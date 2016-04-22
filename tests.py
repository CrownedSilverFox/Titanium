class Team:
    team_colors = ["RED", "GREEN", "BLUE", "YELLOW"]

    def __init__(self):
        if not self.team_colors:
            raise ValueError("Game Full")
        self.color = self.team_colors.pop(0)

    def __del__(self):
        self.team_colors.insert(0, self.color)

    def __repr__(self):
        return "Team {}".format(self.color)


teams = [Team(), Team(), Team()]

teams.pop(0)
teams.append(Team())
del teams[1]
try:
    teams.append(Team())
    teams.append(Team())
    teams.append(Team())
    teams.append(Team())
    teams.append(Team())
    teams.append(Team())
except ValueError as error:
    print(error)
print(len(teams))
for team in teams:
    print(team.color)