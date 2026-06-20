export default function DatasetPreviewSection({
    rows
}) {

    return (
        <>
        <h2>Dataset Preview</h2>

              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    {rows.length > 0 &&
                      rows[0].map(
                        (header, index) => (
                          <th key={index}>
                            {header}
                          </th>
                        )
                      )}
                  </tr>
                </thead>

                <tbody>
                  {rows.slice(1).map(
                    (row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map(
                          (cell, cellIndex) => (
                            <td key={cellIndex}>
                              {cell}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
        </>
    );
}