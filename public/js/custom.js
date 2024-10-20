function deletedepartment(id) {
  if (confirm("Do you want to delete this department?")) {
    $.ajax({
      url: "/deletedepartment",
      type: "DELETE",
      data: { id },
      success: function (response) {
        console.log(response);
        location.reload();
      },
      error: function () {
        console.log("error");
      },
    });
  }
}
function deleteemployee(id) {
  if (confirm("Do you want to delete this employee?")) {
    $.ajax({
      url: "/deleteemployee",
      type: "DELETE",
      data: { id },
      success: function (response) {
        console.log(response);
        location.reload();
      },
      error: function () {
        console.log("error");
      },
    });
  }
}
