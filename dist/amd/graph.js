(function() {
  define(['./polygon', './ops', './barnes_hut'], function(Polygon, O, bh) {
    var attractive_forces, cap, inside, map_objects, random_position;
    random_position = function(w, h) {
      return [Math.random() * w, Math.random() * h];
    };
    cap = function(bound, x) {
      return Math.min(Math.max(x, 0), bound);
    };
    inside = function(w, h) {
      return function(arg) {
        var x, y;
        x = arg[0], y = arg[1];
        return [cap(w, x), cap(h, y)];
      };
    };
    map_objects = function(obj, f) {
      var k, result, v;
      result = [];
      for (k in obj) {
        v = obj[k];
        result.push(f(k, v));
      }
      return result;
    };
    attractive_forces = function(links, positions, attraction) {
      var end, force, forces, id, pos1, pos2, ref, start, weight;
      forces = {};
      for (id in links) {
        ref = links[id], start = ref.start, end = ref.end, weight = ref.weight;
        pos1 = positions[start];
        pos2 = positions[end];
        force = O.times(attraction * weight, O.minus(pos1, pos2));
        if (forces[start] == null) {
          forces[start] = [0, 0];
        }
        if (forces[end] == null) {
          forces[end] = [0, 0];
        }
        forces[start] = O.minus(forces[start], force);
        forces[end] = O.plus(forces[end], force);
      }
      return forces;
    };
    return function(arg) {
      var attraction, bound, constrain, constraints, data, end, graph, height, id, j, len, len1, link, linkaccessor, links, links_, m, node, nodeaccessor, nodes, nodes_, nodes_positions, recompute, ref, repulsion, start, threshold, tick, unconstrain, weight, width;
      data = arg.data, nodeaccessor = arg.nodeaccessor, linkaccessor = arg.linkaccessor, width = arg.width, height = arg.height, attraction = arg.attraction, repulsion = arg.repulsion, threshold = arg.threshold;
      if (nodeaccessor == null) {
        nodeaccessor = function(n) {
          return n;
        };
      }
      if (linkaccessor == null) {
        linkaccessor = function(l) {
          return l;
        };
      }
      if (attraction == null) {
        attraction = 1;
      }
      if (repulsion == null) {
        repulsion = 1;
      }
      if (threshold == null) {
        threshold = 0.5;
      }
      bound = inside(width, height);
      nodes = data.nodes, links = data.links, constraints = data.constraints;
      if (constraints == null) {
        constraints = {};
      }
      nodes_positions = {};
      nodes_ = {};
      for (j = 0, len = nodes.length; j < len; j++) {
        node = nodes[j];
        id = nodeaccessor(node);
        nodes_positions[id] = constraints[id] || random_position(width, height);
        nodes_[id] = node;
      }
      links_ = {};
      for (m = 0, len1 = links.length; m < len1; m++) {
        link = links[m];
        ref = linkaccessor(link), start = ref.start, end = ref.end, weight = ref.weight;
        links_[start + "|" + end] = {
          weight: weight,
          start: start,
          end: end,
          link: link
        };
      }
      tick = function() {
        var attractions, bodies, f, f1, f2, position, repulsions, root, tree;
        bodies = bh.bodies(nodes_positions);
        root = bh.root(width, height);
        tree = bh.tree(bodies, root);
        attractions = attractive_forces(links_, nodes_positions, attraction / 1000);
        repulsions = bh.forces(tree, repulsion * 1000, threshold);
        for (id in nodes_positions) {
          position = nodes_positions[id];
          if (constraints[id]) {
            nodes_positions[id] = constraints[id];
          } else {
            f1 = attractions[id] || [0, 0];
            f2 = repulsions[id] || [0, 0];
            f = O.plus(f1, f2);
            nodes_positions[id] = bound(O.plus(position, f));
          }
        }
        return recompute();
      };
      constrain = function(id, position) {
        return constraints[id] = position;
      };
      unconstrain = function(id) {
        return delete constraints[id];
      };
      graph = {
        tick: tick,
        constrain: constrain,
        unconstrain: unconstrain
      };
      recompute = function() {
        var i;
        i = -1;
        graph.curves = map_objects(links_, function(id, arg1) {
          var end, link, p, q, start;
          start = arg1.start, end = arg1.end, link = arg1.link;
          i += 1;
          p = nodes_positions[start];
          q = nodes_positions[end];
          return {
            link: Polygon({
              points: [p, q],
              closed: false
            }),
            item: link,
            index: i
          };
        });
        graph.nodes = map_objects(nodes_, function(id, node) {
          return {
            point: nodes_positions[id],
            item: node
          };
        });
        return graph;
      };
      return recompute();
    };
  });

}).call(this);
