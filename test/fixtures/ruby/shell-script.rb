#!/usr/bin/env ruby
require 'nokogiri'
require 'optparse'
require 'pathname'

SYSTEMS = ARGV

NAME_MAP = {
  'arcade' => 'Arcade Games',
  'daphne' => 'Laserdisc Games'
}

GAMELIST_ROOT = Pathname.new('/home/pi/.emulationstation/gamelists/')

output = []

$options = {
  require: ['name', 'genre', 'developer']
}

opts = OptionParser.new do |o|
  o.banner = "Usage: make-game-list [options] [systems]"
  o.separator ""

  o.on('-r', '--require=FOO,BAR', "Skip games that lack any of these fields (default: name, genre, developer)") do |value|
    $options[:require] = value.split(',')
  end
end

begin
  opts.parse!
rescue OptionParser::InvalidArgument => e
  STDERR.puts("#{e.message}\n\n")
  STDERR.puts(opts)
  exit 1
end

def fails_requirements?(meta)
  $options[:require].any? { |k| meta[k.to_sym].nil? }
end

def html_for_game(game)
  id = File.basename( game.at_css('path').content, '.zip' )
  name = game.at_css('name').content
  date = game.at_css('releasedate').content rescue nil
  year = date.nil? ? nil : date[0..3]
  genre = game.at_css('genre').content rescue nil
  developer = game.at_css('developer').content rescue nil
  description = game.at_css('desc').content rescue nil

  return '' if fails_requirements?({
    name:      name,
    year:      year,
    genre:     genre,
    developer: developer
  })

%Q[
  <tr>
    <td data-game="#{id}" data-value="#{name}">
      <a href="#" class="game-link" data-toggle="popover" data-title="#{name}">#{name}
      <div class="game-description">#{description}</div>
    </td>
    <td>#{year || '?'}</td>
    <td>#{genre || '?'}</td>
    <td>#{developer || '?'}</td>
  </tr>
]

end

def html_for_system(path)
  xml = Nokogiri::XML( path.open )
  system = path.dirname.basename.to_s

  games = xml.css('gameList > game')

  rows = games.map { |game| html_for_game(game) }

%Q(
<h2 class="system-title">#{NAME_MAP[system] || system}</h2>
<table class="table table-bordered table-collapsed table-striped sortable">
  <thead>
    <tr>
      <th>Game</th>
      <th>Year</th>
      <th>Genre</th>
      <th>Manufacturer</th>
    </tr>
  </thead>
  <tbody>
    #{rows}
  </tbody>
</table>
)
end

SYSTEMS.each do |system|
  path = GAMELIST_ROOT.join(system, 'gamelist.xml')
  output << html_for_system(path)
end

output = output.join("\n")

content = <<-HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Nostalgia-Tron Games List</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=News+Cycle:700|Oxygen">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <style type="text/css" media="screen">
      h1, h2, h3:not(.popover-title) {
        font-family: 'News Cycle', sans-serif;
      }

      h3.popover-title {
        font-weight: bold;
      }

      h2.system-title {
        margin: 2.5rem 0 2rem;
      }

      body {
        font-family: 'Oxygen', sans-serif;
        padding-top: 3rem;
        padding-bottom: 3rem;
      }

      .popover {
        font-family: 'Oxygen', sans-serif;
      }

      .game-description {
        display: none;
      }
    </style>
  </head>

  <body>

    <div class="container">
      #{output}
    </div>

    <script type="text/javascript">
      $(function () {
        // When we open a popover, hide any others that may be open.
        $('a.game-link').click(function (e) {
          e.preventDefault();
          var $others = $('[data-toggle="popover"]').not(e.target);
          $others.popover('hide');
          $(e.target).popover('toggle');
        });

        // Make popovers wider.
        $('a.game-link').on('show.bs.popover', function () {
          $(this).data("bs.popover").tip().css("max-width", "600px");
        });

        // Hide a popover whenever someone clicks off.
        $('body').click(function (e) {
          var $anchor = $(e.target).closest('a.game-link');
          var $popover = $(e.target).closest('.popover');
          if ($anchor.length > 0 || $popover.length > 0) return;
          $('[data-toggle="popover"]').popover('hide');
        });

        $('[data-toggle="popover"]').popover({
          html: true,
          trigger: 'manual',
          container: 'body',
          placement: 'auto bottom',
          content: function () {
            var text = $(this).closest('td').find('.game-description').text();
            text = "<p>" + text + "</p>";
            text = text.replace(/\\n\\s*\\n/g, "</p>\\n<p>");
            return text;
          }
        });
      });
    </script>
  </body>
</html>
HTML

puts content
