const URL = "http://localhost:8080";
Vue.createApp({
  data() {
    return {
      trails: [],
      add_name_input: "",
      add_distance_input: 0,
      add_difficulty_input: 0,
      search_input: "",

      editing: false,
      editing_trail: {},
      editing_indx: -1,
    };
  },
  methods: {
    get_trails: async function () {
      let response = await fetch(`${URL}/mtbtrails`);
      let data = await response.json();
      this.trails = data;
    },

    clear_search: function () {
      this.search_input = "";
    },

    delete_trail: async function (indx) {
      let request_options = {
        method: "DELETE",
      };

      let response = await fetch(
        `${URL}/mtbtrails/${this.trails[indx]._id}`,
        request_options
      );

      if (response.status === 200) {
        this.trails.splice(indx, 1);
      } else {
        alert("Failed to delete trail");
      }
    },

    add_trail: async function () {
      let obj = {
        name: this.add_name_input,
        distance: this.add_distance_input,
        difficulty: this.add_difficulty_input,
      };
      this.add_name_input = "";
      this.add_distance_input = 0;
      this.add_difficulty_input = 0;

      let my_headers = new Headers();
      my_headers.append("Content-Type", "application/x-www-form-urlencoded");
      let encoded_data =
        "name=" +
        encodeURIComponent(obj.name) +
        "&distance=" +
        encodeURIComponent(obj.distance) +
        "&difficulty=" +
        encodeURIComponent(obj.difficulty);

      let request_options = {
        method: "POST",
        body: encoded_data,
        headers: my_headers,
      };

      let response = await fetch(`${URL}/mtbtrails`, request_options);

      if (response.status === 201) {
        let data = await response.json();
        this.trails.push(data);
      } else {
        alert("Failed to add trail");
      }
    },

    edit_trail: function (indx) {
      this.editing = true;
      this.editing_indx = indx;
      this.editing_trail = Object.assign({}, this.trails[indx]);
    },

    save_trail: async function () {
      let my_headers = new Headers();
      my_headers.append("Content-Type", "application/x-www-form-urlencoded");
      let encoded_data =
        "name=" +
        encodeURIComponent(this.editing_trail.name) +
        "&distance=" +
        encodeURIComponent(this.editing_trail.distance) +
        "&difficulty=" +
        encodeURIComponent(this.editing_trail.difficulty);

      let request_options = {
        method: "PUT",
        body: encoded_data,
        headers: my_headers,
      };

      let trail_id = this.trails[this.editing_indx]._id;

      let response = await fetch(
        `${URL}/mtbtrails/${trail_id}`,
        request_options
      );
      if (response.status == 204) {
        this.trails[this.editing_indx].name = this.editing_trail.name;
        this.trails[this.editing_indx].distance = parseFloat(
          this.editing_trail.distance
        );
        this.trails[this.editing_indx].difficulty =
          this.editing_trail.difficulty;
      } else {
        alert("Failed to save expense");
      }

      this.editing = false;
    },
  },

  computed: {
    filtered_trails: function () {
      return this.trails.filter((trail) => {
        return trail.name
          .toLowerCase()
          .includes(this.search_input.toLowerCase());
      });
    },
  },

  created: function () {
    this.get_trails();
  },
}).mount("#app");
